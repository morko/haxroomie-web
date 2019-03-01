export function getPlugins() {
  return (dispatch, getState) => {
    let socket = getState().connection.socket;
    if (!socket) return;

    socket.emit('send-haxroomie', {
      type: 'CALL_HHM',
      payload: {
        fn: 'getPlugins'
      },
      sender: socket.id
    });
  }
}

export function enablePlugin(name) {
  return (dispatch, getState) => {
    let socket = getState().connection.socket;
    if (!socket) return;

    socket.emit('send-haxroomie', {
      type: 'CALL_HHM',
      payload: {
        fn: 'enablePlugin',
        args: [name]
      },
      sender: socket.id
    });
  }
}

export function disablePlugin(name) {
  return (dispatch, getState) => {
    let socket = getState().connection.socket;
    if (!socket) return;

    socket.emit('send-haxroomie', {
      type: 'CALL_HHM',
      payload: {
        fn: 'disablePlugin',
        args: [name]
      },
      sender: socket.id
    });
  }
}