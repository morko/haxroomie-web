/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React, { Component } from 'react';
import { 
  Card,
  CardHeader, 
  CardBody,
  Button,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Collapse
} from 'reactstrap';
import DynamicForm from '../../Forms/DynamicForm';

function PluginEnableButton (props) {
  let pluginName = props.pluginName;
  let isEnabled = props.isEnabled;
  let enablePlugin = props.enablePlugin;
  let disablePlugin = props.disablePlugin;

  return (
    <Button className="PluginEnableButton"
      onClick={isEnabled 
        ? () => disablePlugin(pluginName)
        : () => enablePlugin(pluginName)}
      size="sm" 
      color={isEnabled ? "primary" : "secondary"}>
      {isEnabled ? 'Disable' : 'Enable'}
    </Button>
  );
}

class RoomConfig extends Component {

  constructor(props) {
    super(props);
    this.handleConfigSubmit = this.handleConfigSubmit.bind(this);
  }

  handleConfigSubmit(event, config) {
    console.error('Submitting the config is not yet supported.')
  }

  render() {

    let config = this.props.config;

    return (
      <DynamicForm 
        className="RoomConfigForm"
        onSubmit={this.handleConfigSubmit}
        inputsDisabled={true}
        object={config}>
        <h1>Config</h1>
      </DynamicForm>
    );
  }
}

class PluginListItem extends Component {

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = { collapse: false };
  }

  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }

  render() {
    let enablePlugin = this.props.enablePlugin;
    let disablePlugin = this.props.disablePlugin;
    let isEnabled = this.props.isEnabled;
    let name = this.props.name;
    let author = this.props.author;
    let dependencies = this.props.dependencies;
    let config = this.props.config;

    return (
      <ListGroupItem className="container">
        <Row>
          <Col xs="4" md="2">
            <PluginEnableButton
              pluginName={name}
              isEnabled={isEnabled}
              enablePlugin={enablePlugin}
              disablePlugin={disablePlugin}
            />
          </Col>
          <Col xs="6" md="3">
            {name && <p>{name}</p>}
            {!name && <p>unnamed</p>}
          </Col>
        
          <Col className="d-none d-md-inline"  md="2">
            {author && <p>{author}</p>}
            {!author && <p>no author</p>}
          </Col>
        
          <Col className="d-none d-md-inline" md="4">
            {dependencies && <p>{dependencies.join(', ')}</p>}
            {!dependencies && <p style={{color:"grey"}}>no dependencies</p>}
          </Col>
  
          <Col xs="2" md="1">
          {config && 
            <Button className="dropdown-toggle" color="primary" onClick={this.toggle} ></Button>
          }
          </Col>
        </Row>
        <Collapse isOpen={this.state.collapse}>
        {config &&
          <Row>
            <Col>
              <RoomConfig config={config}/>
            </Col>
          </Row>
        }
        </Collapse>
      </ListGroupItem>
    );
  }
}

function PluginList(props) {
  let pluginList = props.pluginList;
  let enablePlugin = props.enablePlugin;
  let disablePlugin = props.disablePlugin;

  const pluginRows = pluginList.map((plugin) => {

    let id = plugin.id;
    let isEnabled = plugin.isEnabled;
    let pluginSpec = plugin.pluginSpec;
    let name = pluginSpec && plugin.pluginSpec.name;
    let author = pluginSpec && plugin.pluginSpec.author;
    let dependencies = pluginSpec && plugin.pluginSpec.dependencies;
    let config = pluginSpec && plugin.pluginSpec.config;

    return (
      <PluginListItem key={id}
        enablePlugin={enablePlugin}
        disablePlugin={disablePlugin}
        isEnabled={isEnabled}
        name={name}
        author={author}
        dependencies={dependencies}
        config={config}
      />
    );
  });

  return (
    <ListGroup>
      {pluginRows}
    </ListGroup>

  )
}

export default class PluginsCard extends Component {

  componentWillMount() {
    this.props.getPlugins();
  }

  render() {
    return (
      <div className="PluginsCard Card">
        <Card color="dark">
          <CardHeader className="text-white">Plugins</CardHeader>
          <CardBody className="bg-light">
            <PluginList
              pluginList={this.props.pluginList}
              enablePlugin={this.props.enablePlugin}
              disablePlugin={this.props.disablePlugin}
            />
          </CardBody>
  
        </Card>
      </div>
    );
  }
}