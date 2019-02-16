let defaultState = {
  list: [],
  playerListError: ''
}

function handleRoomEvent(state, newState, action) {
  let handlerName = action.payload.handlerName;

  if (handlerName === 'onPlayerJoin') {
    let player = action.payload.args[0];
    // create new list so that redux realizes to update
    newState.list = newState.list.slice(0);
    newState.list.push(player);
    return newState;
  }

  if (handlerName === 'onPlayerLeave') {
    let player = action.payload.args[0];
    newState.list = newState.list.filter(p => p.id !== player.id);
    return newState;
  }

  if (handlerName === 'onPlayerAdminChange') {
    let player = action.payload.args[0];
    newState.list = newState.list.map(p => {
      if (p.id === player.id) p.admin = player.admin;
      return p;
    });
    return newState;
  }
  return state;
}

/**
 * getPlayerList has the ID concatenated to the name. This will remove it.
 */
function trimPlayerName(player) {
  player.name = player.name.replace(/#[^#]*$/g, '');
  return player;
}

function player(state = defaultState, action) {
  let newState = Object.assign({}, state, {});

  switch (action.type) {

    case 'CALL_ROOM_RESULT':
      if (action.payload.fn !== 'getPlayerList') return state;
      // haxball sends the host player as null so remove it and trim the name
      newState.list = action.payload.result
        .filter(p => p !== null)
        .map(p => trimPlayerName(p));
      return newState;

    case 'CALL_ROOM_ERROR':
      if (action.payload.fn !== 'getPlayerList') return state;
      newState.playerListError = action.payload.msg;
      return newState;

    case 'ROOM_EVENT':
      return handleRoomEvent(state, newState, action);

    default:
      return state;
  }
}

export default player;
