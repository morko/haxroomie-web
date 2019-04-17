import React, { Component } from 'react';
import { Card, CardHeader, ListGroup, ListGroupItem, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import PasswordListGroupItem from './PasswordListGroupItem';

export default class RoomInfoCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
      showAdminPassword: false
    }

    this.toggleShowPassword = this.toggleShowPassword.bind(this);
    this.toggleShowAdminPassword = this.toggleShowAdminPassword.bind(this);

  }

  toggleShowPassword() {
    this.setState( prevState => ({
      showPassword: !prevState.showPassword
    }));
  }

  toggleShowAdminPassword() {
    this.setState( prevState => ({
      showAdminPassword: !prevState.showAdminPassword
    }));
  }

  render() {
    return (
      <div className="RoomInfoCard Card">
        <Card color="dark">
          <CardHeader className="text-white">Room Info</CardHeader>
          <ListGroup>
            <ListGroupItem>
              <a href={this.props.roomInfo.roomLink} className="m-0">
                {this.props.roomInfo.roomLink}
              </a>
            </ListGroupItem>

            <ListGroupItem className="container">
              <Row>
                <Col xs="3" sm="4">
                  Room name:
                </Col>
                <Col xs="9" sm="8">
                  {this.props.roomInfo.roomName}
                </Col>
              </Row>
            </ListGroupItem>

            <ListGroupItem className="container">
              <Row>
                <Col xs="3" sm="4">
                  Host name:
                </Col>
                <Col xs="9" sm="8">
                  {this.props.roomInfo.playerName}
                </Col>
              </Row>
            </ListGroupItem>

            <ListGroupItem className="container">
              <Row>
                <Col xs="3" sm="4">
                  Max players:
                </Col>
                <Col xs="9" sm="8">
                  {this.props.roomInfo.maxPlayers}
                </Col>
              </Row>
            </ListGroupItem>

            <ListGroupItem className="container">
              <Row>
                <Col xs="3" sm="4">
                  Public:
                </Col>
                <Col xs="9" sm="8">
                  {this.props.roomInfo.public ? 'yes' : 'no'}
                </Col>
              </Row>
            </ListGroupItem>

            {this.props.roomInfo.password &&
              <PasswordListGroupItem password={this.props.roomInfo.password} />
            }

            {this.props.roomInfo.hostPassword &&
              <PasswordListGroupItem 
                label="Host password:"
                password={this.props.roomInfo.hostPassword} 
              />
            }
            
            {this.props.roomInfo.adminPassword &&
              <PasswordListGroupItem 
                label="Admin password:"
                password={this.props.roomInfo.adminPassword} 
              />
            }

          </ListGroup>
        </Card>
      </div>
    );
  }
}

RoomInfoCard.propTypes = {
  roomInfo: PropTypes.shape({
    roomName: PropTypes.string.isRequired,
    playerName: PropTypes.string.isRequired,
    password: PropTypes.string,
    maxPlayers: PropTypes.number.isRequired,
    public: PropTypes.bool,
    roomLink: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    geo: PropTypes.shape({
      code: PropTypes.string,
      lat: PropTypes.number,
      lon: PropTypes.number
    })
  })
};