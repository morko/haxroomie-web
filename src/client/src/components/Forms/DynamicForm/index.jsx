/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React, { Component } from 'react';
import { 
  Card,
  CardTitle,
  CardBody,
  Input,
  Form,
  FormGroup,
  Label
} from 'reactstrap';

function generateInputs(formObject, handleOnChange, inputsDisabled) {
  if (!formObject) return (<p>no config</p>);

  return Object.keys(formObject).map((key) => {
    let value = formObject[key];

    if (typeof value === 'boolean') {
      return (
        <FormGroup key={key} check>
          <Label check>
            <Input 
              type="checkbox" 
              defaultChecked={value} 
              disabled={inputsDisabled}/>{' '}
            {key}
          </Label>
        </FormGroup>
      );
    }

    if (typeof value === 'string') {
      return (
        <FormGroup key={key}>
          <Label for={key}>{key}</Label>
          <Input 
            type="text"
            name={key}
            id={key}
            value={value} 
            onChange={handleOnChange}
            disabled={inputsDisabled}
          />
        </FormGroup>
      );
    }

    if (typeof value === 'number') {
      return (
        <FormGroup key={key}>
          <Label for={key}>{key}</Label>
          <Input 
            type="text"
            name={key}
            id={key}
            value={value} 
            onChange={handleOnChange}
            disabled={inputsDisabled}
          />
        </FormGroup>
      );
    }

    if (typeof value === 'object') {
      return (
        <ObjectInput
          key={key}
          objectKey={key} 
          objectValue={value} 
          handleOnChange={handleOnChange} 
          inputsDisabled={inputsDisabled}
        />
      );
    }

    return (<p>undefined</p>);
  }); 
}

function ObjectInput(props) {
  let objectKey = props.objectKey;
  let objectValue = props.objectValue;
  let inputsDisabled = props.inputsDisabled;

  function handleOnChange(event, keyFromChild, valueFromChild) {
    let key = event.target.name;
    let value = event.target.value;

    if (valueFromChild) {
      objectValue[keyFromChild] = valueFromChild;
      props.handleOnChange(event, objectKey, {...objectValue,  [keyFromChild]: valueFromChild});
    } else {
      props.handleOnChange(event, objectKey, { ...objectValue, [key]: value });
    }
  }

  return (
    <Card className={`ObjectInput`}>
      <CardBody>
        <CardTitle><h3>{objectKey}</h3></CardTitle>
        {generateInputs(objectValue, handleOnChange, inputsDisabled)}
      </CardBody>
    </Card>
  );
}

export default class DynamicForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      object: {},
      inputsDisabled: false
    }
    this.handleOnChange = this.handleOnChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

  }

  componentDidMount() {
    if (this.props.object) {
      this.setState({
        object: this.props.object,
        inputsDisabled: this.props.inputsDisabled
      });
    }
  }

  handleOnChange(event, keyFromChild, valueFromChild) {
    this.setState(state => ({
      object: {...state.object, [keyFromChild]: valueFromChild}
    }));
  }

  handleSubmit(event) {
    if (this.props.onSubmit) this.props.onSubmit(event, this.state.object);
  }

  render() {

    let object = this.state.object;
    let children = this.props.children;
    let handleSubmit = this.handleSubmit;

    const inputs = generateInputs(object, this.handleOnChange, this.state.inputsDisabled);

    return (
      <Card>
        <CardBody>
          <Form onSubmit={handleSubmit}>
            {children}
            {inputs}
          </Form>
        </CardBody>
      </Card>
    );
  }
}