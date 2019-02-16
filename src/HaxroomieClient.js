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
    this.session.subscribe(this.id, this.onHaxroomieActionReceived.bind(this));
  }

  disconnectFromSession() {
    if (!this.session) return;
    this.session.unsubscribe(this.id);
  }

  /**
   * Registers listeners for events sent from the socket and relay them to the
   * running room instance.
   */
  // TODO: maybe this would be the best place to do validation of the data?
  registerListeners(socket) {
    socket.on('send-room', (action) => {
      if (action.type === 'CALL_ROOM') {
        let args = action.payload.args || [];
        this.callRoom(action.payload.fn, ...args);
      } else {
        this.sendToHaxroomie(action);
      }
    });
  }

  /**
   * Sends actions to the haxroomie.
   */
  sendToHaxroomie(action) {
    if(!this.session) return false;
    this.session.sendToRoom(action);
    return true;
  }

  async callRoom(fn, ...args) {
    if (!this.session || !this.socket) return;
    let result;
    try {
      result = await this.session.callRoom(fn, ...args);
    } catch (err) {
      this.socket.emit('haxroomie-action', {
        type: 'CALL_ROOM_ERROR',
        payload: {
          fn: fn,
          msg: err.message
        },
        error: true,
        sender: this.id
      });
      return;
    }

    this.socket.emit('haxroomie-action', {
      type: 'CALL_ROOM_RESULT',
      payload: {
        fn: fn,
        result: result
      },
      sender: this.id
    });
  }

  /**
   * Relays all the actions to the socket to be handled on the client side.
   */
  onHaxroomieActionReceived(action) {
    if (!this.socket) {
      logger.error(`CLIENT (${this.id}): missing socket`);
      this.session.unsubscribe(this.id);
    }
    // send only the error message
    if (action.error) action.payload = action.payload.message;
    this.socket.emit('haxroomie-action', action);
  }
}
