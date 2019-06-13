export function getPlugins() {
  return (dispatch, getState) => {
    let socket = getState().connection.socket;
    if (!socket) return;

    socket.emit('client-action', {
      type: 'CALL_ROOM_CONTROLLER',
      payload: {
        fn: 'getPlugins'
      },
    });
  }
}

export function enablePlugin(name) {
  return (dispatch, getState) => {
    let socket = getState().connection.socket;
    if (!socket) return;

    socket.emit('client-action', {
      type: 'CALL_ROOM_CONTROLLER',
      payload: {
        fn: 'enablePlugin',
        args: [name]
      },
    });
  }
}

export function disablePlugin(name) {
  return (dispatch, getState) => {
    let socket = getState().connection.socket;
    if (!socket) return;

    socket.emit('client-action', {
      type: 'CALL_ROOM_CONTROLLER',
      payload: {
        fn: 'disablePlugin',
        args: [name]
      },
    });
  }
}