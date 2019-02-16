import io from 'socket.io-client';

export const SOCKET_CONNECTED = 'SOCKET_CONNECTED';
export function socketConnected(socket) {
  return {
    type: SOCKET_CONNECTED,
    payload: {
      socket
    }
  }
}

export const SOCKET_DISCONNECTED = 'SOCKET_DISCONNECTED';
export function socketDisconnected() {
  return {
    type: SOCKET_DISCONNECTED,
    payload: null
  }
}

export const OPEN_SOCKET = 'OPEN_SOCKET';
export function openSocket() {
  return (dispatch) => {
    const socket = io();
    // socket.io connection event
    socket.on('connect', () => {
      dispatch(socketConnected(socket));
    });
    // socket.io disconnect event
    socket.on('disconnect', () => {
      dispatch(socketDisconnected());
    });
    // dispatch everything from the haxroomie as actions
    socket.on('haxroomie-action', (action) => {
      dispatch(action);
    });
    socket.open();
  }
}
