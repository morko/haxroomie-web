import { combineReducers } from 'redux';

import connection from './connectionReducer';
import room from './roomReducer';
import player from './playerReducer';
import plugin from './pluginReducer';

export default combineReducers({
  connection,
  room,
  player,
  plugin
});
