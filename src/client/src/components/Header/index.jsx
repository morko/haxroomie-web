import React, { Component } from 'react';
import {
  Collapse,
  Col,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button } from 'reactstrap';
import logo from '../../logo.png';
import PropTypes from 'prop-types';
import ConfirmationModal from '../Modals/ConfirmationModal';
import './index.css';

class Header extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.handleCloseRoom = this.handleCloseRoom.bind(this);
    this.toggleConfirmation = this.toggleConfirmation.bind(this);


    this.state = {
      isOpen: false,
      showConfirmation: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  
  toggleConfirmation() {
    this.setState( prevState => ({
      showConfirmation: !prevState.showConfirmation
    }))
  }

  handleCloseRoom() {
    this.props.closeRoom();
  }

  logOut() {
    window.location = '/logout';
  }

  render() {
    return (
      <header className="Header">
        <Navbar className="Header-navbar" color="dark" dark expand="md">
          <NavbarBrand href="/"><img src={logo} className="Header-logo" alt="logo" /></NavbarBrand>
          <Col className="d-none d-sm-inline">{this.props.title}</Col>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>

            {this.props.closeRoom &&
              <NavItem>
                <Button
                  className="Header-close-room"
                  outline 
                  color="danger" 
                  onClick={this.toggleConfirmation}>
                  Close room
                </Button>
              </NavItem>
            }

            {this.props.userProfile &&
              <UncontrolledDropdown nav inNavbar>
                <div className="Header-user btn btn-outline-secondary">
                  <DropdownToggle nav caret>
                    {this.props.userProfile.name}
                  </DropdownToggle>
                </div>
                <DropdownMenu right>
                  <DropdownItem onClick={this.logOut}>
                    Log out
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            }

            </Nav>
          </Collapse>

          
          <ConfirmationModal 
            show={this.state.showConfirmation}
            question="Are you sure you want to close the room?"
            onNo={this.toggleConfirmation}
            onYes={this.handleCloseRoom}
            toggleShow={this.toggleConfirmation}
          />
        </Navbar>
      </header>
    );
  }
}

export default Header;

Header.defaultProps = {
  title: 'Haxroomie',
}

Header.propTypes = {
  // title of the page
  title: PropTypes.string,
  // text to show on the loading overlay
  closeRoom: PropTypes.func,
  // user menu name
  userProfile: PropTypes.object,

}

