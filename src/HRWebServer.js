const path = require('path');
const server = require('./server');
const HaxroomieClient = require('./HaxroomieClient');
const logger = require('./logging').logger;

module.exports = class Server {
  constructor(opt) {
    if (!opt.haxroomie) {
      throw new Error('Missing required argument: opt.haxroomie');
    }

    this.haxroomie = opt.haxroomie;

    opt = opt || {};

    this.port = opt.port || 3055;

    this.secret = opt.secret;
    this.secure = opt.secure;

    this.storage = opt.storage ||
      path.resolve(path.join(__dirname, '..', 'storage.sqlite'));

    this.defaultUser = opt.defaultUser || {
      name: 'haxroomie',
      password: 'haxroomie'
    }

    this.server = server({
      staticFiles: path.resolve(
        path.join(__dirname, 'client', 'build')
      ),
      enableSocket: true,
      port: this.port,
      database: {
        storage: this.storage
      },
      session: {
        secret: this.secret,
        secure: this.secure
      }
    });
  }

  async listen() {
    await this.server.init();

    await this.server.createUser({ 
      name: this.defaultUser.name, 
      password: this.defaultUser.password
    });

    this.listenSocketConnections();

    return new Promise((resolve, reject) => {
      this.server.httpServer.listen(this.port, (err) => {
        return err ? reject(err) : resolve(this.port);
      });
    });

  }

  async close() {
    this.closeSocketConnections();
    return new Promise((resolve, reject) => {
      this.server.httpServer.close((err) => {
        return err ? reject(err) : resolve(true);
      });
    });
  }

  listenSocketConnections() {
    this.server.socketIO.on('connection', async (socket) => {

      //  get the user from session
      let userProfile = await this._getUserProfileFromSocketSession(socket);
      if (!userProfile) return; // stop if user profile was not found

      logger.debug(
        `SOCKET_CONNECTION ${socket.id} ${JSON.stringify(userProfile)}`
      );
      // create the HaxroomieClient object and connect to the Haxroomie session
      let client = new HaxroomieClient(socket, userProfile);
      client.connectToSession(this.haxroomie);

      socket.on('disconnect', () => {
        logger.debug(`SOCKET ${socket.id} DISCONNECTED`);
        client.disconnectFromSession();
      });
    });
  }

  closeSocketConnections() {
    this.server.io.removeAllListeners('connection');
  }

  /**
   * Returns the user profile from the sockets session or null if there is no session.
   * 
   * @param {socket.io socket} socket 
   */
  async _getUserProfileFromSocketSession(socket) {
    let session = socket.request.session;
    // dont allow users to use the socket without logging in
    if (!session || !session.passport || !session.passport.user ) {
      return null;
    }

    let userID = session.passport.user;

    // find the user from the database
    let User = this.server.database.models.User;
    let user = await User.findById(userID);
    if (!user) {
      throw new Error('No user found for the session user ID: ' + userID);
    }

    return user.getPublicProfile();
  }
}
