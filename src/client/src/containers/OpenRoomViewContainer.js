import { connect } from 'react-redux';
import OpenRoomView from '../components/Views/OpenRoomView/';
import { openRoom, saveConfig } from '../actions/roomActions';

function mapStateToProps(state, ownProps) {
  return {
    userProfile: state.connection.userProfile,
    room: state.room
  }
}

function mapDispatchToProps(dispatch) {
  return {
    openRoom: (roomConfig) => dispatch(openRoom(roomConfig)),
    saveConfig: (roomConfig) => dispatch(saveConfig(roomConfig)),

  }
}

const component = connect(
  mapStateToProps,
  mapDispatchToProps
)(OpenRoomView);

export default component;
