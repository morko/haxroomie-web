const path = require('path');

let config = {

  haxroomie: {
    /*
     * The port that the chromium headless browser will use as the
     * remote-debugging-port.
     *
     * IMPORTANT: Select a port that is not open outside your LAN for
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
    domain: 'localhost',
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
     secret: '',
     /*
      * Account details for the admin user.
      */
     user: {
       name: 'tester',
       email: 'admin@example.com',
       password: 'salamini'
     }
  }
}

module.exports = config;
