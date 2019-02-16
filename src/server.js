/**
  * @module server
  */
const express = require('express');
const http = require('http');
const path = require('path');
const { logger, expressLogger, expressErrorLogger} = require('./logging');
const loginRouter = require('./login-router');

const inProduction = process.env.NODE_ENV === 'production';

module.exports = createServer;

function createServer(opt) {

  opt = opt || {};
  options = parseOptions(opt)

  // express app
  let expressApp = express();
  // express driven httpServer
  let httpServer = null;
  // socket.io
  let socketIO = null;
  // database object with access to sequelize and models
  let database = null;
  // has init() been called
  let initialized = false;
  // express-session instance
  let session = null;
  // passport middleware
  let passport = null;

  /** Object containing express middleware.
   *
   * @typedef {object} Middleware
   *
   * @property {object} isAuthenticated - <p>Middleware that stops the
   *     request-response cycle if the user is not authenticated.</p>
   */
  let middleware = {
    isAuthenticated: require('./middleware/is-authenticated')
  };

  function parseOptions(opt) {
    if (!opt.database) {
      throw new Error('Missing required argument: opt.database');
    }

    let options = {};

    options.port = opt.port || 3055;
    options.staticFiles = opt.staticFiles || null;

    options.requireAuth = opt.hasOwnProperty("requireAuth") ?
        opt.requireAuth :
        true;

    options.enableSocket = opt.hasOwnProperty("enableSocket") ?
        opt.enableSocket :
        true;

    options.session = opt.session || {};

    options.storage = opt.database.storage ||
        path.resolve(path.join(__dirname, '..', 'storage.sqlite'));

    return options;
  }

  /**
   * Server instance object that is created with the
   * {@link module:server~createServer|createServer} factory
   * function.
   *

   * @typedef {object} Server
   *
   * @property {module:server~Middleware} middleware - <p>Object containing
   *     express middleware.</p>
   * @property {external:HttpServer} httpServer - <p>Instance of nodes http
   *     Server initialized with express.</p>
   * @property {external:SocketIO} socketIO - <p>If Server was created with the option
   *     <code>enableSocket: true</code>, then this will be the socket.IO
   *     Server instance. If not then it will be <code>null</code></p>
   * @property {external:ExpressApp} express - <p>Instance of expressApp.</p>
   * @property {module:server~Database} database - <p>Object containing
   *     the initialized instance of Sequelize ORM and models.</p>
   *
   * @property {function} init - Initialize the Server instance.
   * @property {function} listen - Start listening incoming HTTP connections.
   * @property {function} close - Stop listening incoming HTTP connections.
   */
  return {
    middleware,
    get httpServer() {
      if (!initialized) {
        throw new Error('Server is not initialized! Call init() first.');
      }
      return httpServer;
    },
    /**
     * <p>Socket.IO Server instance.
     * Handles communication with TCP sockets between a client and
     * a server.</p>
     *
     * <p>The Server instance has been initialized to use the same express-session
     * middleware than the express app uses. This makes it possible to get hold
     * of the session data.</p>
     *
     * @external SocketIO
     * @see {@link https://socket.io/docs/server-api/|Socket.IO Server API}
     *
     * @example
     * Server.socketIO.on('connection', async (socket) => {
     *     console.debug('A client has connected');
     *     console.debug('The socket session object', socket.request.session);
     *     console.debug('The user of the session', socket.request.session.passport.user);
     * });
     */
    get socketIO() {
      if (!initialized) {
        throw new Error('Seqpress is not initialized! Call init() first.');
      }
      return socketIO;
    },
    get express() {
      return expressApp;
    },
    get database() {
      if (!initialized) {
        throw new Error('Server is not initialized! Call init() first.');
      }
      return database;
    },
    init,
    listen,
    close,
    createUser: async (user) => await database.createUser(user)
  }

  async function init() {
    if (initialized) return;
    logger.debug("Initializing server: "+JSON.stringify(options));
    // initialize the database
    database = await initDatabase();
    // logger middleware for all HTTP requests
    expressApp.use(expressLogger);
    // express-session middleware
    session = initSessions();
    // passport middleware
    passport = initPassport();
    // serve the default static files
    let defaultFiles = path.resolve(path.join(__dirname, 'static'));
    expressApp.use('/seqpress', express.static(defaultFiles));
    // create the routes
    createRouting();
    // logging middleware for errors
    expressApp.use(expressErrorLogger);
    // custom error error handler
    expressApp.use(require('./middleware/error-handler')())
    // create node http.Server
    httpServer = http.createServer(expressApp);
    // enable Socket.IO if requested
    if (options.enableSocket) enableSocket();
    initialized = true;
  }

  async function listen() {
    await init();
    logger.info("Starting the HTTP Server.")
    return new Promise((resolve, reject) => {
      httpServer.listen(options.port, (err) => {
        return err ? reject(err) : resolve(options.port);
      });
    });
  }

  async function close() {
    logger.info("Stopping the HTTP Server.")
    return new Promise((resolve, reject) => {
      httpServer.close((err) => {
        return err ? reject(err) : resolve(true);
      });
    });
  }

  async function initDatabase() {
    // create database, ensure 'sqlite3' in your package.json
    let db = require('./database')(options.storage);
    await db.init();
    return db;
  }

  function enableSocket() {
    socketIO = require('socket.io')(httpServer);
    // wrap the express-session middleware to be used by socket.io too
    socketIO.use(function(socket, next) {
      session.middleware(socket.request, socket.request.res, next);
    });
  }

  function initSessions() {
    if (!database) {
      throw new Error(
        'Database must be initialized before initializing sessions.'
      );
    }
    let ses = require('./middleware/session')({
      ...options.session,
      sequelize: database.sequelize
    });
    expressApp.use(ses.middleware);
    return ses;
  }

  function initPassport() {
    if (!session) {
      throw new Error(
        'Session must be initialized before initializing passport.'
      );
    }
    // body-parser is required by passport
    expressApp.use(require("body-parser").urlencoded({ extended: false }));

    let pp = require('./middleware/passport')(database, {logger: logger});
    expressApp.use(pp.initialize());
    expressApp.use(pp.session());
    return pp;
  }

  function createRouting() {
    // create the login router
    let router = loginRouter(passport, middleware);
    expressApp.use(router);

    // checks if user is authenticated and if not redirects to /login
    if (options.requireAuth) {
      logger.debug('Require authentication enabled.')
      expressApp.use(middleware.isAuthenticated);
    }
    // serve static files
    expressApp.use(express.static(options.staticFiles));

  }


}
