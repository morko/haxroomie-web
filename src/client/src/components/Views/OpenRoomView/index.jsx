import React from 'react';
import {
  Container,
  Row,
  Col,
 } from 'reactstrap';
import Header from '../../Header';
import PropTypes from 'prop-types';
import OpenRoomForm from './OpenRoomForm';
import './index.css';

export default class OpenRoomView extends React.Component {

  render() {
    return (
      <div className="View OpenRoomView">
        <Header 
          title="Room Settings"
          user={this.props.sessionID}
        />
        <Container>
          <Row>
            <Col md={{ size: 8, offset: 2}}>
              <OpenRoomForm 
                openRoom={this.props.openRoom}
                saveConfig={this.props.saveConfig}
                roomConfig={this.props.room.roomConfig}
                errorMessage={this.props.room.openRoomError}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

OpenRoomView.propTypes = {
  openRoom: PropTypes.func,
  saveConfig: PropTypes.func,
  room: PropTypes.object
}