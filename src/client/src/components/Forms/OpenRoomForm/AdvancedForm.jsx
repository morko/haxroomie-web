import React from 'react';
import {
  Button,
  CustomInput,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  FormText,
  Alert,
  Col,
  Label,
  Collapse
} from 'reactstrap';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function HHMInfo(props) {
  return (
    <FormGroup row>
      <Col sm="12">
        <FormText>
        <Alert color="info" style={{marginBottom: 0}}>
          
          <p><FontAwesomeIcon icon="info-circle" size="2x" style={{marginRight: "0.5rem"}}/> 
          These fields can be used as properties of 
          <code> hrConfig</code> object inside the HHM config.</p>
          <dl>
            <dt>Room name</dt>
            <dd><code>hrConfig.roomName</code></dd>
            <dt>Player name</dt>
            <dd><code>hrConfig.playerName</code></dd>
            <dt>Max players</dt>
            <dd><code>hrConfig.maxPlayers</code></dd>
            <dt>Password</dt>
            <dd><code>hrConfig.password</code></dd>
            <dt>Host password</dt>
            <dd><code>hrConfig.hostPassword</code></dd>
            <dt>Admin password</dt>
            <dd><code>hrConfig.adminPassword</code></dd>
            <dt>Token</dt>
            <dd><code>hrConfig.token</code></dd>
          </dl>
          </Alert>
        </FormText>
      </Col>
    </FormGroup>
  );
}

export default class AdvancedForm extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleFileInputChange = this.handleFileInputChange.bind(this);
    this.handleHHMConfigClear = this.handleHHMConfigClear.bind(this);

    this.state = {
      isOpen: this.props.isOpen,
      hhmConfig: this.props.hhmConfig,
    };

  }

  componentDidMount() {
    this.setState({ 
      isOpen: this.props.isOpen,
      hhmConfig: this.props.hhmConfig,
      roomScript: this.props.roomScript,
    });
  }

  handleFileInputChange(event) {
    const name = event.target.name;
    this.setState({ [name]: event.target.files[0].name });
    this.props.handleFileInputChange(event);
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  handleHHMConfigClear(event) {
    this.setState({ hhmConfig: null });
    event.target.files = [];
  }

  render() {
    return (
      <div className="AdvancedForm">
        <div className="clearfix">
          <Button
            className="AdvancedForm-toggle"
            color="secondary"
            onClick={this.toggle}>
            Advanced
          </Button>
        </div>
        <Collapse isOpen={this.state.collapse}>

          <FormGroup>
            <Label for="hhmConfig"><FontAwesomeIcon icon="edit" size="2x" /> HHM config</Label>
            <InputGroup>
              <CustomInput
                type="file"
                name="hhmConfig"
                id="hhmConfig"
                label={this.state.hhmConfig}
                onChange={this.handleFileInputChange} />
              <InputGroupAddon addonType="append">
                <Button onClick={this.handleHHMConfigClear}>Clear</Button>
              </InputGroupAddon>
            </InputGroup>
          </FormGroup>

          <FormGroup row>
            <Col sm="12">
              <FormText>
                See <a href="https://github.com/saviola777/haxball-headless-manager"
                target="_blank" rel="noopener noreferrer">
                HHM docs</a> for information
                about the HHM config.
              </FormText>
            </Col>
          </FormGroup>
          {this.state.hhmConfig && <HHMInfo/> }

        </Collapse>
      </div>
    );
  }
}
