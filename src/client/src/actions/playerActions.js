export const GET_PLAYERS = 'GET_PLAYERS';
export function getPlayers() {
  return (dispatch, getState) => {
    let socket = getState().connection.socket;
    if (!socket) return;

    socket.emit('send-haxroomie', {
      type: 'CALL_ROOM',
      payload: {
        fn: 'getPlayerList'
      },
      sender: socket.id
    });
  }
}

export const KICK_PLAYER = 'KICK_PLAYER';
export function kickPlayer(id, reason = 'Bye!') {
  return (dispatch, getState) => {
    let socket = getState().connection.socket;
    if (!socket) return;

    socket.emit('send-haxroomie', {
      type: 'CALL_ROOM',
      payload: {
        fn: 'kickPlayer',
        args: [id, reason, false]
      },
      sender: socket.id
    });
  }
}

export const BAN_PLAYER = 'BAN_PLAYER';
export function banPlayer(id, reason = 'Bye!') {
  return (dispatch, getState) => {
    let socket = getState().connection.socket;
    if (!socket) return;

    socket.emit('send-haxroomie', {
      type: 'CALL_ROOM',
      payload: {
        fn: 'kickPlayer',
        args: [id, reason, true]
      },
      sender: socket.id
    });
  }
}

export const ADMIN_PLAYER = 'ADMIN_PLAYER';
export function adminPlayer(id) {
  return (dispatch, getState) => {
    let socket = getState().connection.socket;
    if (!socket) return;

    socket.emit('send-haxroomie', {
      type: 'CALL_ROOM',
      payload: {
        fn: 'setPlayerAdmin',
        args: [id, true]
      },
      sender: socket.id
    });
  }
}

export const UNADMIN_PLAYER = 'UNADMIN_PLAYER';
export function unadminPlayer(id) {
  return (dispatch, getState) => {
    let socket = getState().connection.socket;
    if (!socket) return;

    socket.emit('send-haxroomie', {
      type: 'CALL_ROOM',
      payload: {
        fn: 'setPlayerAdmin',
        args: [id, false]
      },
      sender: socket.id
    });
  }
}

export const CLEAR_BANS = 'CLEAR_BANS';
export function clearBans() {
  return (dispatch, getState) => {
    let socket = getState().connection.socket;
    if (!socket) return;

    socket.emit('send-haxroomie', {
      type: 'CALL_ROOM',
      payload: {
        fn: 'clearBans'
      },
      sender: socket.id
    });
  }
}