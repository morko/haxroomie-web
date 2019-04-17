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
import JSONInput from 'react-json-editor-ajrm';
import locale    from 'react-json-editor-ajrm/locale/en';

function HHMInfo(props) {
  return (
    <FormGroup row>
      <Col sm="12">
        <FormText>
        <Alert color="info" style={{marginBottom: 0}}>
          
          <p><FontAwesomeIcon icon="info-circle" size="2x" style={{marginRight: "0.5rem"}}/> 
          These fields can be used as properties of 
          <code> haxroomie</code> object inside the HHM config.</p>
          <dl>
            <dt>Room name</dt>
            <dd><code>haxroomie.roomName</code></dd>
            <dt>Player name</dt>
            <dd><code>haxroomie.playerName</code></dd>
            <dt>Max players</dt>
            <dd><code>haxroomie.maxPlayers</code></dd>
            <dt>Password</dt>
            <dd><code>haxroomie.password</code></dd>
            <dt>Host password</dt>
            <dd><code>haxroomie.hostPassword</code></dd>
            <dt>Admin password</dt>
            <dd><code>haxroomie.adminPassword</code></dd>
            <dt>Token</dt>
            <dd><code>haxroomie.token</code></dd>
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
    this.handleHHMConfigFileClear = this.handleHHMConfigFileClear.bind(this);
    this.handlePluginConfigChange = this.handlePluginConfigChange.bind(this);

    this.state = {
      isOpen: this.props.isOpen,
      hhmConfigFile: this.props.hhmConfigFile,
      pluginFile: this.props.pluginFile,
      repository: this.props.repository,
      pluginConfig: this.props.pluginConfig
    };

    this.JSONFieldColors = {
      default: '#444444',
      error: '#FA1111',
      background: '#FCFDFD',
      background_warning: '#FEECEB',
      string: '#FA7921',
      number: '#70CE35',
      colon: '#49B8F7',
      keys: '#59A5D8',
      keys_whiteSpace: '835FB6',
      primitive: '#386FA4'
    }
  }

  componentDidMount() {
    this.setState({ 
      isOpen: this.props.isOpen,
      hhmConfigFile: this.props.hhmConfigFile,
      pluginFile: this.props.pluginFile,
      repository: this.props.repository,
      pluginConfig: this.props.pluginConfig
    });
  }

  handleFileInputChange(event) {
    const name = event.target.name;
    this.setState({ [name]: event.target.files[0].name });
    this.props.handleFileInputChange(event);
  }

  handlePluginConfigChange(event) {
    this.props.handlePluginConfigChange(event);
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  handleHHMConfigFileClear(event) {
    this.setState({ hhmConfigFile: null });
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
            <Label for="pluginConfigJSON"><FontAwesomeIcon icon="plug" size="2x" /> Plugin config</Label>
            <FormText>
              Configuration for the Headless Haxball Manager plugins. Use JSON syntax.
              Allows you to pass configurations to plugins. You can not use the
              <code> haxroomie</code> object inside this. The <code>haxroomie </code>
              object can be only accessed inside custom HHM config.
              See <a href="https://github.com/saviola777/haxball-headless-manager/wiki"
              target="_blank" rel="noopener noreferrer">saviolas Haxball Headless Manager wiki </a> 
              for more information.
            </FormText>
            <div className="PluginConfigField">
              <JSONInput
                id = "pluginConfigJSON"
                colors = { this.JSONFieldColors }
                placeholder = { this.state.pluginConfig }
                locale = { locale }
                height = "400px"
                width = "100%"
                onChange = { this.handlePluginConfigChange }
              />
            </div>

          </FormGroup>

          <FormGroup>
            <Label for="hhmConfigFile"><FontAwesomeIcon icon="edit" size="2x" /> Custom HHM config</Label>
            <InputGroup>
              <CustomInput
                type="file"
                name="hhmConfigFile"
                id="hhmConfigFile"
                label={this.state.hhmConfigFile}
                onChange={this.handleFileInputChange} />
              <InputGroupAddon addonType="append">
                <Button onClick={this.handleHHMConfigFileClear}>Clear</Button>
              </InputGroupAddon>
            </InputGroup>
          </FormGroup>

          <FormGroup row>
            <Col sm="12">
              <FormText>
                See <a href="https://github.com/saviola777/haxball-headless-manager"
                target="_blank" rel="noopener noreferrer">
                saviolas Haxball Headless Manager repository</a> for information
                about the HHM config.
              </FormText>
            </Col>
          </FormGroup>
          {this.state.hhmConfigFile && <HHMInfo/> }

        </Collapse>
      </div>
    );
  }
}
