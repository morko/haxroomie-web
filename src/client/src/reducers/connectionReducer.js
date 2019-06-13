import {
  SOCKET_CONNECTED,
  SOCKET_DISCONNECTED
} from '../actions/connectionActions';

let defaultState = {
  socket: null,
  userProfile: null,
}

function connection(state = defaultState, action) {
  switch (action.type) {
    case SOCKET_CONNECTED:
      return Object.assign({}, state, {
        socket: action.payload.socket
      });
    case SOCKET_DISCONNECTED:
      return Object.assign({}, state, {
        socket: null,
        userProfile: null
      });
    case 'ROOM_CONNECTED':
      return Object.assign({}, state, {
        userProfile: action.payload.userProfile
      });
    case 'ROOM_DISCONNECTED':
      return Object.assign({}, state, {
        userProfile: null
      });
    default:
      return state;
  }
}

export default connection;
