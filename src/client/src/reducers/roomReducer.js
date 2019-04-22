let defaultState = {
  roomInfo: null,
  openRoomInProcess: false,
  openRoomError: '',
  roomConfig: {
    roomName: 'haxroomie',
    playerName: 'host',
    maxPlayer: 8,
    public: false,
    password: '',
    hostPassword: '',
    adminPassword: '',
    token: '',
    hhmConfigFile: null,
    roomScript: null,
    repositories: [],
    pluginConfig: {
      'sav/commands': {
        'commandPrefix': '!',
      }
    }
  }
}

function room(state = defaultState, action) {
  let newState = Object.assign({}, state, {});

  switch (action.type) {

    case 'OPEN_ROOM_START':
      newState.openRoomInProcess = true;
      if (action.error) {
        newState.openRoomInProcess = false;
        newState.openRoomError = action.payload;
      }
      return newState;

    case 'OPEN_ROOM_STOP':
      newState.openRoomInProcess = false;

      if (action.error) {
        newState.openRoomError = action.payload;
        return newState;
      }
      newState.roomInfo = action.payload.roomInfo;
      newState.openRoomError = null;
      return newState;
    
    case 'CLIENT_CONNECTED':
      newState.roomInfo = action.payload.roomInfo;
      return newState;

    case 'ROOM_CLOSED':
      newState.roomInfo = null;
      newState.openRoomInProcess = false;
      newState.openRoomError = null;
      return newState;

    case 'SAVE_CONFIG':
      newState.roomConfig = action.payload.roomConfig;
      return newState;

    default:
      return state;
  }
}

export default room;
