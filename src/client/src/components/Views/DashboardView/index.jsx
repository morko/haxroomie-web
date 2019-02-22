import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';

import Header from '../../Header';
import { PlayersCard, RoomInfoCard, PluginsCard } from '../../Cards';
import PropTypes from 'prop-types';
import './index.css';

export default class DashboardView extends Component {
  render() {
    return (
      <div className="View DashboardView">
        <Header 
          title="Dashboard"
          user={this.props.sessionID}
          closeRoom={this.props.closeRoom}
          />
        <Container>
          <Row>
            <Col xs="12" lg="6">
              <RoomInfoCard roomInfo={this.props.roomInfo} />
            </Col>
            <Col xs="12" lg="6">
              <PlayersCard
                playerList={this.props.playerList}
                getPlayers={this.props.getPlayers}
                kickPlayer={this.props.kickPlayer}
                banPlayer={this.props.banPlayer}
                adminPlayer={this.props.adminPlayer}
                unadminPlayer={this.props.unadminPlayer}
              />
            </Col>
            <Col xs="12">
              <PluginsCard
                pluginList={this.props.pluginList}
                getPlugins={this.props.getPlugins}
                enablePlugin={this.props.enablePlugin}
                disablePlugin={this.props.disablePlugin}
              />
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

DashboardView.propTypes = {
  getPlayers: PropTypes.func,
  roomInfo: PropTypes.object,
  closeRoom: PropTypes.func,
  sessionID: PropTypes.string,
  playerList: PropTypes.array
}