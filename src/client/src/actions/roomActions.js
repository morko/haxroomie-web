export const OPEN_ROOM = 'OPEN_ROOM';
export function openRoom(roomConfig) {
  return (dispatch, getState) => {
    let socket = getState().connection.socket;
    if (!socket) return;

    socket.emit('client-action', {
      type: 'OPEN_ROOM',
      payload: {
        roomConfig: roomConfig
      },
    });
  }
}

export const CLOSE_ROOM = 'CLOSE_ROOM';
export function closeRoom(roomConfig) {
  return (dispatch, getState) => {
    let socket = getState().connection.socket;
    if (!socket) return;

    socket.emit('client-action', {
      type: 'CLOSE_ROOM',
    });
  }
}

export const SAVE_CONFIG = 'SAVE_CONFIG';
export function saveConfig(roomConfig) {
  return {
    type: SAVE_CONFIG,
    payload: {
      roomConfig
    }
  }
}

