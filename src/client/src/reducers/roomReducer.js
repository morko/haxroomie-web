let defaultState = {
  roomInfo: null,
  openRoomInProcess: false,
  openRoomError: '',
  closeRoomError: '',
  pageClosedError: '',
  pageCrashedError: '',
  roomConfig: {
    roomName: 'haxroomie',
    playerName: 'host',
    maxPlayer: 8,
    public: false,
    password: '',
    hostPassword: '',
    adminPassword: '',
    token: '',
    hhmConfig: null,
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

    case 'ROOM_CONNECTED':
      newState.roomInfo = action.payload.roomInfo;
      return newState;

    case 'PAGE_CLOSED':
      newState.openRoomInProcess = false;
      newState.roomInfo = null;
      newState.pageClosedError = action.payload.error.msg;
      return newState;

    case 'PAGE_CRASHED':
      newState.openRoomInProcess = false;
      newState.roomInfo = null;
      newState.pageCrashedError = action.payload.error.msg;
      return newState;

    case 'OPEN_ROOM_START':
      clearErrors(newState);
      newState.openRoomInProcess = true;
      return newState;

    case 'OPEN_ROOM_STOP':
      newState.openRoomInProcess = false;
      newState.roomInfo = action.payload.roomInfo;
      return newState;

    case 'OPEN_ROOM_ERROR':
      newState.openRoomInProcess = false;
      newState.openRoomError = action.payload.error.msg;
      return newState;

    case 'CLOSE_ROOM':
      clearErrors(newState);
      newState.roomInfo = null;
      newState.openRoomInProcess = false;
      return newState;
    
    case 'CLOSE_ROOM_ERROR':
      newState.closeRoomError = action.payload.error.msg;
      return newState;
  
    case 'SAVE_CONFIG':
      newState.roomConfig = action.payload.roomConfig;
      return newState;

    default:
      return state;
  }
}

function clearErrors(state) {
  state.openRoomError = '';
  state.closeRoomError = '';
  state.pageClosedError = '';
  state.pageCrashedError = '';
}


export default room;
