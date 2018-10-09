import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  UncontrolledDropdown,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import withAuth from '@/components/withAuth';
import Search from '@/components/Search';

const StyledNavbarBrand = styled(NavbarBrand)`
  font-weight: bold;
`;

class RealitiesNavbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    };
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  render() {
    return (
      <Navbar color="faded" light expand="md">
        <StyledNavbarBrand tag={Link} to="/">
          Realities
        </StyledNavbarBrand>
        <div className="flex-grow-1 mr-3">
          <Search />
        </div>
        <NavbarToggler onClick={this.toggle} />
        <Collapse isOpen={this.state.isOpen} navbar className="flex-grow-0">
          <Nav className="ml-auto" navbar>
            <NavItem>
              <NavLink tag={Link} to="/about">About</NavLink>
            </NavItem>
            {this.props.auth.isLoggedIn ? (
              <UncontrolledDropdown nav>
                <DropdownToggle nav caret>
                  {this.props.auth.email}
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>
                    <NavLink onClick={this.props.auth.logout} href="#">Logout</NavLink>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            ) : (
              <NavItem>
                <NavLink onClick={this.props.auth.login} href="#">Login</NavLink>
              </NavItem>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}

RealitiesNavbar.defaultProps = {
  auth: {
    isLoggedIn: false,
    email: 'example@example.com',
    login: () => null,
    logout: () => null,
  },
};

RealitiesNavbar.propTypes = {
  auth: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
    email: PropTypes.string,
    login: PropTypes.func,
    logout: PropTypes.func,
  }),
};

export default withAuth(RealitiesNavbar);
