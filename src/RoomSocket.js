const logger = require('./logging').logger;
const roomEventHandler = require('./RoomEventHandler');

module.exports = class RoomSocket {
  /**
   * @param {Socket} socket socket.io Socket
   * @param {Object} userProfile
   */
  constructor(opt) {

    opt = opt || {};
    if (!opt.socket) {
      throw new Error('Missing argument: opt.socket');
    }
    if (!opt.userProfile) {
      throw new Error('Missing argument: opt.userProfile');
    }
    if (!opt.haxroomie) {
      throw new Error('Missing argument: opt.haxroomie');
    }
    this.socket = opt.socket;
    this.userProfile = opt.userProfile;
    this.haxroomie = opt.haxroomie;
    this.id = this.socket.id;
    this.room = null;
    this.roomEventHandler = null;

    this.onPageClosed = this.onPageClosed.bind(this);
    this.onPageCrashed = this.onPageCrashed.bind(this);
  }

  /**
   * Starts relaying messages between the socket and RoomController.
   */
  async start() {
    this.room = await this.getRoomController();
    this.addRoomListeners(this.room);
    this.addSocketListeners(this.socket);
    this.socket.emit('server-action', {
      type: 'ROOM_CONNECTED',
      payload: {
        userProfile: this.userProfile,
        roomInfo: this.room.roomInfo
      }
    });
  }

  /**
   * Stops relaying messages between the socket and RoomController.
   */
  async stop() {
    this.removeSocketListeners(this.socket);
    this.removeRoomListeners(this.room);
    this.socket.emit('server-action', {
      type: 'ROOM_DISCONNECTED',
      payload: {
        userProfile: this.userProfile
      }
    });
  }

  /**
   * Gets the RoomController that this socket handles.
   */
  async getRoomController() {
    let roomId = this.userProfile.name;
    if (this.haxroomie.hasRoom(roomId)) {
      return this.haxroomie.getRoom(roomId);
    }
    return this.haxroomie.addRoom(roomId);
  }

  addRoomListeners(room) {
    this.roomEventHandler = new roomEventHandler({
      room: room,
      socket: this.socket
    });

    room.on(`page-closed`, this.onPageClosed);
    room.on(`page-crash`, this.onPageCrashed);
  }

  removeRoomListeners(room) {
    if (this.roomEventHandler) {
      this.roomEventHandler.removeListeners(room);
    }
    room.removeListener(`page-closed`, this.onPageClosed);
    room.removeListener(`page-crash`, this.onPageCrashed);
  }

  /**
   * If the page gets closed, then recreate the RoomController.
   */
  async onPageClosed() {
    this.removeRoomListeners(this.room);
    await this.haxroomie.removeRoom(this.room.id);
    this.room = await this.getRoomController();
    this.addRoomListeners(this.room);
    this.socket.emit(`server-action`, {
      type: 'PAGE_CLOSED',
    });
  }
  /**
   * If the page crashes, then recreate the RoomController.
   */
  async onPageCrashed(error) {
    this.removeRoomListeners(this.room);
    await this.haxroomie.removeRoom(this.room.id);
    this.room = await this.getRoomController();
    this.addRoomListeners(this.room);
    this.socket.emit(`server-action`, {
      type: 'PAGE_CRASHED',
      payload: {
        error
      }
    });
  }

  /**
   * Registers listeners for events sent from the socket and to relay
   * them to the RoomController.
   */
  addSocketListeners(socket) {
    socket.on('client-action', this.onClientAction.bind(this));
  }

  /**
   * Unregister socket listeners.
   */
  removeSocketListeners(socket) {
    socket.removeAllListeners('client-action');
  }

  /**
   * Handles the actions that are sent from the client side.
   * 
   * @param {object} action - Action from the client side.
   */
  async onClientAction(action) {

    let payload = action.payload || {};
    let args = payload.args || [];

    switch (action.type) {

      case 'CALL_ROOM':
        await this.callRoom(payload.fn, ...args);
        break;

      case 'CALL_ROOM_CONTROLLER':
        await this.callRoomController(payload.fn, ...args);
        break;

      case 'OPEN_ROOM':
        await this.openRoom(payload.roomConfig);
        break;

      case 'CLOSE_ROOM':
        await this.closeRoom();
        break;

      default:
        break;
    }
  }

  /**
   * Calls a function in the 
   * [haxball roomObject](https://github.com/haxball/haxball-issues/wiki/Headless-Host#roomobject).
   * 
   * @param {string} fn - function of haxball roomObject
   * @param  {...any} args - arguments for the function
   */
  async callRoom(fn, ...args) {
    let result;
    try {
      result = await this.room.callRoom(fn, ...args);
    } catch (err) {
      this.onCallError('CALL_ROOM', fn, err);
      return;
    }
    this.onCallResult('CALL_ROOM', fn, result);
  }

  /**
   * Calls a function in the RoomController.
   * 
   * @param {string} fn - Function in the RoomController
   * @param  {...any} args - arguments for the function
   */
  async callRoomController(fn, ...args) {
    let result;
    try {
      result = await this.room[fn](...args);
    } catch (err) {
      this.onCallError('CALL_ROOM_CONTROLLER', fn, err);
      return;
    }
    this.onCallResult('CALL_ROOM_CONTROLLER', fn, result);
  }

  async openRoom(config) {
    try {
      await this.room.openRoom(config);
    } catch(err) {
      logger.error(err);
      this.socket.emit('server-action', {
        type:'OPEN_ROOM_ERROR',
        payload: {
          error: err
        }
      });
    }
  }

  async closeRoom() {
    try {
      await this.room.closeRoom();
    } catch(err) {
      logger.error(err);
      this.socket.emit('server-action', {
        type:'CLOSE_ROOM_ERROR',
        payload: {
          error: err
        }
      });
    }
  }

  /**
   * Handles the errors that can happen when calling the functions in 
   * RoomController. 
   * 
   * Logs the error and sends the error to the client aswell.
   * 
   * @param {string} type - action type from the action that was sent by 
   *    webclient
   * @param {string} fn - function that was called
   * @param {Error} error - the error that happened
   */
  onCallError(type, fn, error) {
    let errorType = `${type}_ERROR`;
    logger.error(`${errorType}: ${fn}\n${error.stack}`);

    this.socket.emit('server-action', {
      type: errorType,
      payload: {
        fn: fn,
        msg: error.message
      },
      error: true,
    });
  }

  /**
   * Handles successfull calls to the function in RoomController object.
   * 
   * @param {string} type - action type from the action that was sent by 
   *    webclient
   * @param {string} fn - function that was called
   * @param {any} result - the return value of the function
   */
  onCallResult(type, fn, result) {
    let resultType = `${type}_RESULT`;

    this.socket.emit('server-action', {
      type: resultType,
      payload: {
        fn: fn,
        result: result
      },
    });
  }


}
