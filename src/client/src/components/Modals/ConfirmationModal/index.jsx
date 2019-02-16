/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import PropTypes from 'prop-types';

export default class ConfirmationModal extends Component {
  constructor(props) {
    super(props);

    this.handleYes = this.handleYes.bind(this);
    this.handleNo = this.handleNo.bind(this);
  }

  handleYes() {
    this.props.onYes();
    this.props.toggleShow();
  }
  handleNo() {
    this.props.toggleShow();
  }

  render() {
    return (
      <Modal className="ConfirmationModal" isOpen={this.props.show} toggle={this.props.toggleShow}>
        <ModalHeader toggle={this.props.toggleShow}>Confirmation needed.</ModalHeader>
        <ModalBody>
          {this.props.question}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.handleYes}>Yes</Button>{' '}
          <Button color="secondary" onClick={this.handleNo}>No</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

Modal.propTypes = {
  // should the modal be visible?
  show: PropTypes.bool,
  // callback for toggling props.show
  toggleShow:  PropTypes.func,
  // the question to ask from user
  question: PropTypes.string,
  // callback if the user answers yes
  onYes: PropTypes.func
}
