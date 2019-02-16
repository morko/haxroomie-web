import { connect } from 'react-redux';
import DashboardView from '../components/Views/DashboardView/';
import { closeRoom } from '../actions/roomActions';
import { 
  getPlayers, 
  kickPlayer, 
  banPlayer, 
  adminPlayer, 
  unadminPlayer 
} from '../actions/playerActions';


function mapStateToProps(state, ownProps) {
    return {
      sessionID: state.connection.sessionID,
      roomInfo: state.room.roomInfo,
      playerList: state.player.list
    }
  }
  
  function mapDispatchToProps(dispatch) {
    return {
      closeRoom: () => dispatch(closeRoom()),
      getPlayers: () => dispatch(getPlayers()),
      kickPlayer: (id) => dispatch(kickPlayer(id)),
      banPlayer: (id) => dispatch(banPlayer(id)),
      adminPlayer: (id) => dispatch(adminPlayer(id)),
      unadminPlayer: (id) => dispatch(unadminPlayer(id)),
    }
  }
  
  const component = connect(
    mapStateToProps,
    mapDispatchToProps
  )(DashboardView);
  
  export default component;
