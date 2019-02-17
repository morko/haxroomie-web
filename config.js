const path = require('path');

let config = {

  haxroomie: {
    /*
     * The port that the chromium headless browser will use as the
     * remote-debugging-port.
     *
     * IMPORTANT!
     * Select a port that is not open outside your LAN for
     * security reasons.
     */
    port: 3056,
    /*
     * Setting this to true will make haxroomie try to spawn a window. Normally
     * you don't need this unless debugging.
     */
    window: false,
  },

  /*
   * Server side configurations.
   */
  server: {
    /*
     * Port that the express server listens to for incoming HTTP connections.
     */
    port: process.env.PORT || 3055,
    /*
     * Absolute path to the sqlite storage file.
     */
    storage: path.resolve(path.join(__dirname, 'storage.sqlite')),
    /*
     * IMPORTANT!
     * Secret salt to add to the encrypted session ID. You can also generate
     * random salt here, but then you will loose all sessions when you restart
     * the app.
     */
    secret: 'change this',
    /*
     * If true secures the sessions, but requires your server to support HTTPS.
     */
    secure: false,
    /*
     * Account details for the default user. Note that it is not recommended
     * to create the account here because the password is stored here in
     * clear text. You can use e.g. the user.js script to modify user
     * accounts.
     */
    user: {
       name: 'haxroomie',
       password: 'haxroomie'
     }
  }
}

module.exports = config;
