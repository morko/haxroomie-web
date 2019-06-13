import { connect } from 'react-redux';
import DashboardView from '../components/Views/DashboardView/';
import { closeRoom } from '../actions/roomActions';
import { 
  getPlayers, 
  kickPlayer, 
  banPlayer, 
  adminPlayer, 
  unadminPlayer,
  clearBans
} from '../actions/playerActions';
import { 
  getPlugins, 
  enablePlugin,
   disablePlugin
} from '../actions/pluginActions';


function mapStateToProps(state, ownProps) {
    return {
      userProfile: state.connection.userProfile,
      roomInfo: state.room.roomInfo,
      playerList: state.player.list,
      pluginList: state.plugin.list
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
      clearBans: () => dispatch(clearBans()),
      getPlugins: () => dispatch(getPlugins()),
      enablePlugin: (name) => dispatch(enablePlugin(name)),
      disablePlugin: (name) => dispatch(disablePlugin(name))
    }
  }
  
  const component = connect(
    mapStateToProps,
    mapDispatchToProps
  )(DashboardView);
  
  export default component;
