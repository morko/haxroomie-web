import { combineReducers } from 'redux';

import connection from './connectionReducer';
import room from './roomReducer';
import player from './playerReducer';


export default combineReducers({
  connection,
  room,
  player
});
