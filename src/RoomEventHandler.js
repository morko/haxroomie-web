const EventEmitter = require('events');

class RoomEventHandler extends EventEmitter {
  
  constructor(opt) {
    opt = opt || {};

    if (!opt.room) {
      throw new Error(`Missing argument: opt.room`);
    }
    if (!opt.socket) {
      throw new Error(`Missing argument: opt.socket`);
    }
    super();
    this.room = opt.room;
    this.socket = opt.socket;

    this.onPluginLoaded = this.onPluginLoaded.bind(this);
    this.onPluginRemoved = this.onPluginRemoved.bind(this);
    this.onPluginEnabled = this.onPluginEnabled.bind(this);
    this.onPluginDisabled = this.onPluginDisabled.bind(this);
    this.onRoomEvent = this.onRoomEvent.bind(this);
    this.onOpenRoomStart = this.onOpenRoomStart.bind(this);
    this.onOpenRoomStop = this.onOpenRoomStop.bind(this);
    this.onOpenRoomError = this.onOpenRoomError.bind(this);
    this.onCloseRoom = this.onCloseRoom.bind(this);
    this.onPageError = this.onPageError.bind(this);

    this.addListeners(this.room);
  }

  addListeners(room) {
    room.on('room-event', this.onRoomEvent);
    room.on(`plugin-loaded`, this.onPluginLoaded);
    room.on(`plugin-removed`, this.onPluginRemoved);
    room.on(`plugin-enabled`, this.onPluginEnabled);
    room.on(`plugin-disabled`, this.onPluginDisabled);
    room.on(`open-room-start`, this.onOpenRoomStart);
    room.on(`open-room-stop`, this.onOpenRoomStop);
    room.on(`open-room-error`, this.onOpenRoomError);
    room.on(`close-room`, this.onCloseRoom);
    room.on(`page-error`, this.onPageError);
  }

  removeListeners(room) {
    room.removeListener('room-event', this.onRoomEvent);
    room.removeListener(`plugin-loaded`, this.onPluginLoaded);
    room.removeListener(`plugin-removed`, this.onPluginRemoved);
    room.removeListener(`plugin-enabled`, this.onPluginEnabled);
    room.removeListener(`plugin-disabled`, this.onPluginDisabled);
    room.removeListener(`open-room-start`, this.onOpenRoomStart);
    room.removeListener(`open-room-stop`, this.onOpenRoomStop);
    room.removeListener(`open-room-error`, this.onOpenRoomError);
    room.removeListener(`close-room`, this.onCloseRoom);
    room.removeListener(`page-error`, this.onPageError);
  }


  onRoomEvent(roomEventArgs) {
    let handlerName = roomEventArgs.handlerName;
    let args = roomEventArgs.args || [];
    if (typeof this[handlerName] === 'function') {
      this[handlerName](...args);
    }
  }


  onPageError(error) {
    this.socket.emit(`server-action`, {
      type: 'PAGE_ERROR',
      payload: {
        error
      }
    });
  }

  onOpenRoomStart(roomConfig) {
    this.socket.emit(`server-action`, {
      type: 'OPEN_ROOM_START',
      payload: {
        roomConfig
      }
    });
  }

  onOpenRoomStop(roomInfo) {
    this.socket.emit(`server-action`, {
      type: 'OPEN_ROOM_STOP',
      payload: {
        roomInfo
      }
    });
  }

  onOpenRoomError(error) {
    this.socket.emit(`server-action`, {
      type: 'OPEN_ROOM_ERROR',
      payload: {
        error
      }
    });
  }

  onCloseRoom() {
    this.socket.emit(`server-action`, {
      type: 'CLOSE_ROOM'
    });
  }


  onPluginLoaded(pluginData) {
    this.socket.emit(`server-action`, {
      type: 'PLUGIN_EVENT',
      payload: {
        eventType: 'pluginLoaded',
        pluginData: pluginData

      }
    });
  }

  onPluginRemoved(pluginData) {
    this.socket.emit(`server-action`, {
      type: 'PLUGIN_EVENT',
      payload: {
        eventType: 'pluginRemoved',
        pluginData: pluginData

      }
    });
  }

  onPluginEnabled(pluginData) {
    this.socket.emit(`server-action`, {
      type: 'PLUGIN_EVENT',
      payload: {
        eventType: 'pluginEnabled',
        pluginData: pluginData

      }
    });
  }

  onPluginDisabled(pluginData) {
    this.socket.emit(`server-action`, {
      type: 'PLUGIN_EVENT',
      payload: {
        eventType: 'pluginDisabled',
        pluginData: pluginData

      }
    });
  }

  onPlayerJoin(player) {
    this.socket.emit(`server-action`, {
      type: 'PLAYER_JOIN',
      payload: {
        player: player,
      }
    });
  }

  onPlayerLeave(player) {
    this.socket.emit(`server-action`, {
      type: 'PLAYER_LEAVE',
      payload: {
        player,
      }
    });
  }
  
  onPlayerAdminChange(changedPlayer, byPlayer) {
    this.socket.emit(`server-action`, {
      type: 'PLAYER_ADMIN_CHANGE',
      payload: {
        changedPlayer,
        byPlayer
      }
    });
  }
}

module.exports = RoomEventHandler;