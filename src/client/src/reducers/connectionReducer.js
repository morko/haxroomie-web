import {
  SOCKET_CONNECTED,
  SOCKET_DISCONNECTED
} from '../actions/connectionActions';

let defaultState = {
  socket: null,
  sessionID: null,
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
        sessionID: null
      });
    case 'CLIENT_CONNECTED':
      return Object.assign({}, state, {
        sessionID: action.sender
      });
    default:
      return state;
  }
}

export default connection;
