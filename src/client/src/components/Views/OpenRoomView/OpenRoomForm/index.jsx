import React from 'react';
import {
  Row,
  Col,
  Button,
  CustomInput,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  FormText,
  Collapse
} from 'reactstrap';
import PropTypes from 'prop-types';
import './index.css';

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

class AdvancedForm extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleFileInputChange = this.handleFileInputChange.bind(this);

    this.state = { 
      collapse: false,
      hhmConfigFile: ''
    };
  }

  handleFileInputChange(event) {
    const name = event.target.name;
    if (name === 'hhmConfigFile') {
      this.setState({ [name]: event.target.files[0].name });
    }
    this.props.handleFileInputChange(event);
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
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
            <Label for="hhmConfigFile">HHM config</Label>
            <CustomInput 
              type="file" 
              name="hhmConfigFile"
              id="hhmConfigFile"
              label={this.state.hhmConfigFile}
              onChange={this.handleFileInputChange} />
          </FormGroup>

          <FormGroup>
            <Label for="pluginFiles">Plugins</Label>
            <Input 
              type="file" 
              name="pluginFiles" 
              id="pluginFiles"
              multiple 
              onChange={this.handleFileInputChange}/>
          </FormGroup>

        </Collapse>
      </div>
    );
  }
}

export default class OpenRoomForm extends React.Component {

  constructor(props) {
    super(props);

    this.state =  this.props.roomConfig;

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFileInputChange = this.handleFileInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState(this.props.roomConfig);
  }

  createMaxPlayersOptions(maxPlayers) {
    let options = [];
    for (let i = 0; i < maxPlayers; i++) {
      options.push(<option key={i+1}>{i+1}</option>);
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

    if (name === 'hhmConfigFile') {
      let file = event.target.files[0];
      if (!file) return;

      let fileReader = new FileReader();
      fileReader.onloadend = (e) => {

        let hhmConfigFile = {
          name: file.name,
          content: fileReader.result
        };

        this.setState(
          { 
            hhmConfigFile: hhmConfigFile 
          }, 
          () => this.props.saveConfig(this.state)
        );
      }
      fileReader.readAsText(file);
    }

    if (name === 'pluginFiles') {

      for (let file of event.target.files) {

        let fileReader = new FileReader();
        fileReader.onloadend = (e) => {

          let pluginFile = {
            name: file.name,
            content: fileReader.result
          };

          this.setState( prevState =>
            ({ 
              pluginFiles: [...prevState.pluginFiles, pluginFile],
            }), 
            () => this.props.saveConfig(this.state)
          );
        }
        fileReader.readAsText(file);
      }
    }
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
          onChange={this.handleInputChange}
        />

        <FormTextRow
          type="text"
          label="Player name"
          name="playerName"
          value={this.state.playerName}
          onChange={this.handleInputChange}
        />

        <FormGroup row>
          <Label for="maxPlayers" sm="3">Max players</Label>
          <Col sm="3">
            <Input 
              defaultValue="8"
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
          onChange={this.handleInputChange}
        />

        <FormTextRow 
          type="password" 
          label="Admin password" 
          name="adminPassword" 
          value={this.state.adminPassword}
          onChange={this.handleInputChange}>
          Get admin ingame with !auth admin [password]
        </FormTextRow>
        
        <FormTextRow
          type="text"
          label="Token"
          name="token"
          valid={this.state.token}
          value={this.state.token}
          onChange={this.handleInputChange}>
          Obtain a token <a href="https://www.haxball.com/headlesstoken" 
          target="_blank">here</a> and insert it above.
        </FormTextRow>

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

        <Button className="OpenRoomForm-submit"color="success">Open Room</Button>

        <AdvancedForm handleFileInputChange={this.handleFileInputChange} />

      </Form>
    );
  }
}

OpenRoomForm.propTypes = {
  openRoom: PropTypes.func,
  errorMessage: PropTypes.string
}