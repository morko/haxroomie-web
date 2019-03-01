const logger = require('./logging').logger;

module.exports = class HaxroomieClient {
  /**
   * @param {Socket} socket socket.io Socket
   * @param {Object} userProfile
   */
  constructor(socket, userProfile) {
    this.socket = socket;
    this.id = socket.id;
    this.userProfile = userProfile;
    this.session = null;
    this.registerListeners(this.socket);
  }

  async connectToSession(haxroomie) {
    // get the room Session object for the user and subscribe to actions
    this.session = await haxroomie.getSession(this.userProfile.name);
    this.session.subscribe(this.id, this.onHaxroomieMessageReceived.bind(this));
  }

  disconnectFromSession() {
    this.session.unsubscribe(this.id);
  }

  /**
   * Relays all the actions to the socket to be handled on the client side.
   */
  onHaxroomieMessageReceived(action) {
    if (!this.socket) {
      logger.error(`CLIENT (${this.id}): missing socket`);
      this.session.unsubscribe(this.id);
    }
    // send only the error message
    if (action.error) action.payload = action.payload.message;
    this.socket.emit('haxroomie-message', action);
  }

  /**
   * Registers listeners for events sent from the socket and to relay
   * them to the session.
   */
  // TODO: should validate the data?
  registerListeners(socket) {
    socket.on('send-haxroomie', async (action) => {

      let payload = action.payload || {};
      let args = payload.args || [];

      switch (action.type) {

        case 'CALL_ROOM':
          await this.onCallRoom(payload.fn, ...args);
          break;

        case 'CALL_HHM':
          await this.onCallHHM(payload.fn, ...args);
          break;

        case 'OPEN_ROOM':
          await this.onOpenRoom(payload.roomConfig);
          break;

        case 'CLOSE_ROOM':
          await this.onCloseRoom();
          break;

        default:
          break;
      }

    });
  }

  async onOpenRoom(config) {
    try {
      await this.session.openRoom(config);
    } catch(err) {
      logger.error(err);
      this.socket.emit('haxroomie-message', {
        type:'OPEN_ROOM_STOP',
        sender: this.session.id,
        error: true,
        payload: err.message
      });
    }
  }

  async onCloseRoom() {
    try {
      await this.session.closeRoom();
    } catch(err) {
      logger.error(err);
      this.socket.emit('haxroomie-message', {
        type:'CLOSE_ROOM_ERROR',
        sender: this.session.id,
        error: true,
        payload: err.message
      });
    }
  }

  /**
   * Handles the errors that can happen when calling the functions in session
   * object. Logs the error ands send the error to the client aswell.
   * 
   * @param {string} type - action type from the action that was sent by 
   *    webclient
   * @param {string} fn - function that was called
   * @param {Error} error - the error that happened
   */
  onCallError(type, fn, error) {
    let errorType = `${type}_ERROR`;
    logger.error(`${errorType}: ${fn}\n${error.stack}`);

    this.socket.emit('haxroomie-message', {
      type: errorType,
      payload: {
        fn: fn,
        msg: error.message
      },
      error: true,
      sender: this.id
    });
  }

  /**
   * Handles successfull calls to the function in this.session object.
   * 
   * @param {string} type - action type from the action that was sent by 
   *    webclient
   * @param {string} fn - function that was called
   * @param {any} result - the return value of the function
   */
  onCallResult(type, fn, result) {
    let resultType = `${type}_RESULT`;

    this.socket.emit('haxroomie-message', {
      type: resultType,
      payload: {
        fn: fn,
        result: result
      },
      sender: this.id
    });
  }


  /**
   * Calls a function in the 
   * [haxball roomObject](https://github.com/haxball/haxball-issues/wiki/Headless-Host#roomobject).
   * 
   * @param {string} fn - function of haxball roomObject
   * @param  {...any} args - arguments for the function
   */
  async onCallRoom(fn, ...args) {
    let result;
    try {
      result = await this.session.callRoom(fn, ...args);
    } catch (err) {
      this.onCallError('CALL_ROOM', fn, err);
      return;
    }
    this.onCallResult('CALL_ROOM', fn, result);
  }

  /**
   * Tests if the HHM function is valid.
   * 
   * @param {string} fn - function to be tested
   */
  isSupportedHHMFunction(fn) {
    return (
      fn === 'getPlugin' 
      || fn === 'getPlugins'
      || fn === 'enablePlugin'
      || fn === 'disablePlugin'
      || fn === 'getDependentPlugins'
    );
  }

  /**
   * Calls a function in the Haxball Headless Manager using the session objects
   * supported functions.
   * 
   * @param {string} fn - supported HHM function of this.session
   * @param  {...any} args - arguments for the function
   */
  async onCallHHM(fn, ...args) {
    if (!this.isSupportedHHMFunction(fn)) {
      this.onCallError(
        'CALL_HHM', 
        fn, 
        new Error(`UNSUPPORTED_HHM_FUNCTION: ${fn}`)
      );
      return;
    }
    let result;
    try {
      result = await this.session[fn](...args);
    } catch (err) {
      this.onCallError('CALL_HHM', fn, err);
      return;
    }
    this.onCallResult('CALL_HHM', fn, result);
  }
}
