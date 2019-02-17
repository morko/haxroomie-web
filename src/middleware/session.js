/**
 * Module for creating the session middleware for express and connecting
 * it to sequelize.
 *
 * @module session
 */
const session = require('express-session');
// initalize sequelize with session store
const SequelizeStore = require('connect-session-sequelize')(session.Store);

module.exports = createSessionHandler;
/**
 * Initializes the express-session middleware and connects it to sequelize.
 *
 * @param {string} [opt.secret] - A secret that will be used to encrypt
 *     the session id If key is not provided a default key is created 
 *     using crypto module. This randomly generated default key makes the
 *     sessions unusable after the application is restarted.
 * @param {boolean} [opt.secure] - If set to true the session security
 *     will be hardened but it requires your server to support HTTPS.
 * @param {object} [opt.cookie] - Cookie options for express-session. See
 *     {@link https://github.com/expressjs/session#cookie|express-session documentation}.
 *     Default value is
 *     <code>{ path: '/', httpOnly: true, secure: false, maxAge: 2419200000 }</code>,
 *     but <code>secure = true</code> if
 *     <code>process.env.NODE_ENV === 'production'</code>.
 * @returns {object} - Object containing the middleware and session store object.
 */
function createSessionHandler(opt) {
  if (!opt) throw new Error('Missing required argument: opt')
  if (!opt.sequelize) throw new Error('Missing required argument: opt.sequelize');

  let options = {};

  options.secret = opt.secret || require('crypto').randomBytes(64).toString('hex');
  options.secure = opt.hasOwnProperty('secure')
    ? Boolean(opt.secure) 
    : false;

  options.cookie = {
    path: '/',
    httpOnly: true,
    secure: options.secure,
    maxAge: 2419200000,
    ...opt.cookie
  };


  let store = new SequelizeStore({db: opt.sequelize});
  let middleware = session({
    store: store,
    secret: options.secret,
    name: 'sessionId',
    resave: false,
    saveUninitialized: false,
    cookie: options.cookie
  });

  // create the Session table if it does not exist
  store.sync();

  return {
    middleware,
    store
  }
}
