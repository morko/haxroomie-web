export const OPEN_ROOM = 'OPEN_ROOM';
export function openRoom(roomConfig) {
  return (dispatch, getState) => {
    let socket = getState().connection.socket;
    if (!socket) return;

    socket.emit('send-haxroomie', {
      type: 'OPEN_ROOM',
      payload: {
        roomConfig: roomConfig
      },
      sender: socket.id
    });
  }
}

export const CLOSE_ROOM = 'CLOSE_ROOM';
export function closeRoom(roomConfig) {
  return (dispatch, getState) => {
    let socket = getState().connection.socket;
    if (!socket) return;

    socket.emit('send-haxroomie', {
      type: 'CLOSE_ROOM',
      sender: socket.id
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

