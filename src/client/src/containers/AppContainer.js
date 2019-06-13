import { connect } from 'react-redux';

import App from '../components/App';
import { openSocket } from '../actions/connectionActions';


function mapStateToProps(state, ownProps) {
  return {
    userProfile: state.connection.userProfile,
    roomInfo: state.room.roomInfo,
    openRoomInProcess: state.room.openRoomInProcess,

  }
}

function mapDispatchToProps(dispatch) {
  return {
    openSocket: () => dispatch(openSocket())
  }
}

const component = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default component;
