import React, { Component } from 'react';
import { ListGroupItem, Input, Row, Col } from 'reactstrap';
import SmallButton from '../../SmallButton';
import PropTypes from 'prop-types';

export default class PasswordListGroupItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPassword: false,
    }

    this.toggleShowPassword = this.toggleShowPassword.bind(this);
  }

  toggleShowPassword() {
    this.setState( prevState => ({
      showPassword: !prevState.showPassword
    }));
  }

  render() {
    return (
      <ListGroupItem className="container">
        <Row>
          <Col sm="10">
            {this.props.label}
          </Col>
          <Col sm="2">
            <SmallButton onClick={this.toggleShowPassword} style={{float: 'right'}}>
              {this.state.showPassword ? 'hide' : 'show'}
            </SmallButton>
          </Col>
        </Row>

        <Row>
          <Col xsm="12">
            <Input type={this.state.showPassword ? 'text' : 'password'} value={this.props.password} disabled />
          </Col>
        </Row>
      </ListGroupItem>
    );
  }
}

PasswordListGroupItem.defaultProps = {
  label: 'Password:'
}

PasswordListGroupItem.propTypes = {
  password: PropTypes.string,
  label: PropTypes.string
}