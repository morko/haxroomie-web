let defaultState = {
  list: [],
  playerListError: ''
}

/**
 * getPlayerList might have the id concatenated to the name. 
 * This will remove it.
 */
function trimPlayerName(player) {
  player.name = player.name.replace(/#[^#]*$/g, '');
  return player;
}

function player(state = defaultState, action) {
  let newState = Object.assign({}, state, {});
  let player;

  switch (action.type) {

    case 'CALL_ROOM_RESULT':
      if (action.payload.fn !== 'getPlayerList') return state;
      newState.list = action.payload.result
        // remove host player
        .filter(p => p.id !== 0)
        // trim the player name
        .map(p => trimPlayerName(p));
      return newState;

    case 'CALL_ROOM_ERROR':
      if (action.payload.fn !== 'getPlayerList') return state;
      newState.playerListError = action.payload.msg;
      return newState;

    case 'PLAYER_JOIN':
      // create new list so that redux realizes that it has changed
      newState.list = newState.list.slice(0);
      newState.list.push(action.payload.player);
      return newState;
  
    case 'PLAYER_LEAVE':
      player = action.payload.player;
      newState.list = newState.list.filter(p => p.id !== player.id);
      return newState;

    case 'PLAYER_ADMIN_CHANGE':
      player = action.payload.changedPlayer;
      newState.list = newState.list.map(p => {
        if (p.id === player.id) p.admin = player.admin;
        return p;
      });
      return newState;
    
    default:
      return state;
  }
}

export default player;
