import React from 'react';
import {
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  InputGroup,
  CustomInput,
  InputGroupAddon,
  Label,
  Input,
  Alert,
  FormText
} from 'reactstrap';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AdvancedForm from './AdvancedForm';
import './index.css';
import RepositoryField from './RepositoryField';

function FormTextRow(props) {
  let name = props.name;
  let type = props.placeholder;
  let label = props.label;
  let placeholder = props.placeholder;
  let onChange = props.onChange;
  let value = props.value;
  let valid = typeof props.valid === 'undefined' || props.valid;

  return (
    <div className="FormTextRow">
      <FormGroup row>
        <Label for={name} sm="3">{label}</Label>
        <Col sm="9">
          {valid
            ? <Input
              value={value}
              type={type}
              name={name}
              onChange={onChange}
              placeholder={placeholder} />
            : <Input
              invalid
              value={value}
              type={type}
              name={name}
              onChange={onChange}
              placeholder={placeholder} />
          }
        </Col>
      </FormGroup>

      {props.children &&
        <FormGroup row className="FormTextRow-explanation">
          <Col sm="3">
          </Col>
          <Col sm="9">
            <FormText>
              {props.children}
            </FormText>
          </Col>
        </FormGroup>
      }
    </div>

  );
}

export default class OpenRoomForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = this.props.roomConfig;
    this.state.reposError = '';

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFileInputChange = this.handleFileInputChange.bind(this);
    this.handleroomScriptClear = this.handleroomScriptClear.bind(this);
    this.handlePluginConfigChange = this.handlePluginConfigChange.bind(this);
    this.handleRepositoryChange = this.handleRepositoryChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState(this.props.roomConfig);
    this.setState({reposError: ''});
  }

  createMaxPlayersOptions(maxPlayers) {
    let options = [];
    for (let i = 0; i < maxPlayers; i++) {
      options.push(<option key={i + 1}>{i + 1}</option>);
    }
    return options;
  }

  handleInputChange(event) {
    const target = event.target;

    const name = target.name;

    let value = target.type === 'checkbox' ? target.checked : target.value;
    if (name === 'token') value = this.trimToken(value);

    this.setState(
      { [name]: value },
      () => this.props.saveConfig(this.state)
    );
  }

  handleFileInputChange(event) {
    const name = event.target.name;
    let file = event.target.files[0];

    if (!file) return;

    let fileReader = new FileReader();
    fileReader.onloadend = (e) => {

      let fileData = {
        name: file.name,
        content: fileReader.result
      };

      this.setState(
        {
          [name]: fileData
        },
        () => this.props.saveConfig(this.state)
      );
    }
    fileReader.readAsText(file);
  }

  handleRepositoryChange(repositories) {
    this.setState(prevState =>
      ({
        repositories: repositories,
      }),
      () => this.props.saveConfig(this.state)
    );
  }

  handlePluginConfigChange(event) {
    this.setState(prevState =>
      ({
        pluginConfig: event.jsObject,
      }),
      () => this.props.saveConfig(this.state)
    );
  }

  handleroomScriptClear(event) {
    this.setState({ roomScript: null });
    event.target.files = [];
  }

  /**
   * Removes the quotes surrounding the token string if user includes them in
   * the token.
   * @param {string} token 
   */
  trimToken(token) {
    return token.trim().replace(/^"(.+(?="$))"$/, '$1');
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.openRoom(this.state);
  }

  render() {

    return (

      <Form className="OpenRoomForm" onSubmit={this.handleSubmit}>

        {this.props.errorMessage &&
          <Row>
            <Col xs="12">
              <Alert color="danger">
                {this.props.errorMessage}
              </Alert>
            </Col>
          </Row>
        }

        <FormTextRow
          type="text"
          label="Room name"
          name="roomName"
          value={this.state.roomName}
          onChange={this.handleInputChange}>
        </FormTextRow>

        <FormTextRow
          type="text"
          label="Player name"
          name="playerName"
          value={this.state.playerName}
          onChange={this.handleInputChange}>
        </FormTextRow>

        <FormGroup row>
          <Label for="maxPlayers" sm="3">Max players</Label>
          <Col sm="3">
            <Input
              defaultValue="10"
              type="select"
              name="maxPlayers"
              className="maxPlayers"
              value={this.state.maxPlayers}
              onChange={this.handleInputChange}>
              {this.createMaxPlayersOptions(20)}
            </Input>
          </Col>
        </FormGroup>

        <FormTextRow
          type="password"
          label="Password"
          name="password"
          value={this.state.password}
          onChange={this.handleInputChange}>
        </FormTextRow>
        
        <FormTextRow
          type="password"
          label="Host password"
          name="hostPassword"
          value={this.state.hostPassword}
          onChange={this.handleInputChange}>
          Authenticate to host role with <code>!auth admin [password]</code>
        </FormTextRow>

        <FormTextRow
          type="password"
          label="Admin password"
          name="adminPassword"
          value={this.state.adminPassword}
          onChange={this.handleInputChange}>
          Authenticate to admin role with <code>!auth admin [password]</code>
        </FormTextRow>
        
        <FormTextRow
          type="text"
          label="Token"
          name="token"
          valid={this.state.token}
          value={this.state.token}
          onChange={this.handleInputChange}>
          Obtain a token <a href="https://www.haxball.com/headlesstoken"
          target="_blank" rel="noopener noreferrer">here</a> and insert it 
          above.
        </FormTextRow>

        <RepositoryField
          handleRepositoryChange={this.handleRepositoryChange}
          repositories={this.state.repositories}>
        </RepositoryField>


        <FormGroup>
          <Label for="roomScript"><FontAwesomeIcon icon="plug" size="2x" /> Room script</Label>
          <InputGroup>
            <CustomInput
              type="file"
              name="roomScript"
              id="roomScript"
              label={ this.state.roomScript && this.state.roomScript.name }
              onChange={this.handleFileInputChange} />
            <InputGroupAddon addonType="append">
              <Button onClick={this.handleroomScriptClear}>Clear</Button>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>

        <FormGroup row>
          <Col sm="12">
            <FormText>
              Can be a regular regular room script for headless haxball or a HHM plugin.
              See <a href="https://github.com/saviola777/haxball-headless-manager"
              target="_blank" rel="noopener noreferrer">
              saviolas Haxball Headless Manager</a> for information
              about the scripts/plugins. If you want to use multiple plugins
              you need to setup a plugin repository.
            </FormText>
          </Col>
        </FormGroup>

        <FormGroup check>
          <Label check>
            <Input
              type="checkbox"
              name="public"
              value="true"
              onChange={this.handleInputChange} />{' '}
            Public room
          </Label>
        </FormGroup>

        <Button className="OpenRoomForm-submit" color="success">Open Room</Button>

        <AdvancedForm 
          handleFileInputChange={this.handleFileInputChange}
          handleRepositoryChange={this.handleRepositoryChange}
          handlePluginConfigChange={this.handlePluginConfigChange}
          roomScript={this.state.roomScript}
          hhmConfigFile={this.state.hhmConfigFile}
          pluginConfig={this.state.pluginConfig}
        />

      </Form>
    );
  }
}

OpenRoomForm.propTypes = {
  openRoom: PropTypes.func,
  errorMessage: PropTypes.string
}