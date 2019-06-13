import React, { Component } from 'react';

import DashboardViewContainer from '../containers/DashboardViewContainer';
import OpenRoomViewContainer from '../containers/OpenRoomViewContainer';
import LoadingOverlay from './Overlays/LoadingOverlay';
import Footer from './Footer';

class App extends Component {

  componentWillMount() {
    this.props.openSocket();
  }
  
  render() {
    return (
      <div className="App">
        { this.props.userProfile ? '' : <LoadingOverlay text="Connecting..."/> }
        { this.props.openRoomInProcess ? <LoadingOverlay text="Opening the room..."/> : ''}
        { 
          this.props.roomInfo 
            ? <DashboardViewContainer /> 
            : <OpenRoomViewContainer /> 
        }
        <Footer />

      </div>
    );
  }
}

export default App;
