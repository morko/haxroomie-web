/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Table,
  Button, ButtonGroup } from 'reactstrap';
import ConfirmationModal from '../../Modals/ConfirmationModal';
import PropTypes from 'prop-types';
import './index.css';

function AdminButton (props) {
  let player = props.player;
  let adminPlayer = props.adminPlayer;
  let unadminPlayer = props.unadminPlayer

  return (
    <Button className="AdminButton"
      onClick={player.admin 
        ? () => unadminPlayer(player.id)
        : () => adminPlayer(player.id)}
      size="sm" 
      color={player.admin ? "primary" : "secondary"}>
      {player.admin ? 'Unadmin' : 'Admin'}
    </Button>
  );
}

function PlayerTable (props) {
  let playerList = props.playerList;
  let kickPlayer = props.kickPlayer;
  let banPlayer = props.banPlayer;
  let adminPlayer = props.adminPlayer;
  let unadminPlayer = props.unadminPlayer;

  const playerRows = playerList.map((player) => {

    return (
    <tr key={player.id} className="PlayerTableRow">
      <th scope="row">{player.id}</th>
      <td>{player.name}</td>
      <td className="text-right">
      {player.id !== 0 &&
        <ButtonGroup>
          <AdminButton 
            player={player}
            adminPlayer={adminPlayer} 
            unadminPlayer={unadminPlayer}
          />
          <Button 
            onClick={() => {
              kickPlayer(player.id)}}
            size="sm" color="warning">Kick</Button>
          <Button onClick={() => banPlayer(player.id)}
            size="sm" color="danger">Ban</Button>
        </ButtonGroup>
      }
      </td>
    </tr>
    )
  });

  return (
    <Table size="md" className="PlayerTable">
      <thead>
        <tr>
          <th style={{width: "15%"}} scope="col">#</th>
          <th style={{width: "45%"}} scope="col">Player</th>
          <th style={{width: "40%"}} scope="col" className="text-right">Controls</th>
        </tr>
      </thead>
      <tbody className="PlayerTable">{playerRows}</tbody>
    </Table>
  );
}

export default class PlayersCard extends Component {

  constructor(props) {
    super(props);

    this.handleClearBans = this.handleClearBans.bind(this);
    this.toggleConfirmation = this.toggleConfirmation.bind(this);

    this.state = {
      showConfirmation: false
    };
  }

  componentWillMount() {
    this.props.getPlayers();
  }

  toggleConfirmation() {
    this.setState( prevState => ({
      showConfirmation: !prevState.showConfirmation
    }))
  }

  handleClearBans() {
    this.props.clearBans();
  }

  render() {
    return (
      <div className="PlayerTableCard Card">
        <Card color="dark">
          <CardHeader className="text-white">Players</CardHeader>
          <CardBody className="bg-light">
            <Button 
              color="danger" 
              size="sm" 
              className="float-right" 
              onClick={this.toggleConfirmation}>
              Clear bans
            </Button>
            <PlayerTable 
              playerList={this.props.playerList}
              kickPlayer={this.props.kickPlayer}
              banPlayer={this.props.banPlayer}
              adminPlayer={this.props.adminPlayer}
              unadminPlayer={this.props.unadminPlayer}
            />
          </CardBody>
        </Card>

        <ConfirmationModal 
          show={this.state.showConfirmation}
          question="Are you sure you want to clear all bans from the room?"
          onNo={this.toggleConfirmation}
          onYes={this.handleClearBans}
          toggleShow={this.toggleConfirmation}
        />
      </div>
    );
  }
}

PlayersCard.propTypes = {
  playerList: PropTypes.array,
  getPlayers: PropTypes.func,
  kickPlayer: PropTypes.func,
  banPlayer: PropTypes.func,
  adminPlayer: PropTypes.func,
  unadminPlayer: PropTypes.func
}
