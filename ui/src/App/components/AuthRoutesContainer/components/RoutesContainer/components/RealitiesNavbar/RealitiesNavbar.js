import React, { useState } from 'react';
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
import { Link, useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import _ from 'lodash';
import useAuth from 'services/useAuth';
import Search from 'components/Search';
import ViewerName from 'components/ViewerName';

const StyledNavbarBrand = styled(NavbarBrand)`
  font-weight: bold;
`;

const RealitiesNavbar = () => {
  // can't use useParams here because we're technically not inside the Route
  // here so we do this instead ¯\_(ツ)_/¯
  const match = useRouteMatch('/:orgSlug');
  const orgSlug = _.get(match, 'params.orgSlug', '');

  const [isOpen, setIsOpen] = useState(false);

  const {
    isLoggedIn, login, logout,
  } = useAuth();

  return (
    <Navbar color="faded" light expand="md">
      <StyledNavbarBrand tag={Link} to={`/${orgSlug}`}>
        Realities
      </StyledNavbarBrand>
      <div className="flex-grow-1 mr-3 d-none d-md-block ">
        <Search />
      </div>
      <NavbarToggler onClick={() => setIsOpen(!isOpen)} />
      <Collapse isOpen={isOpen} navbar className="flex-grow-0">
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink tag={Link} to={`/${orgSlug}/graph`}>Graph</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to={`/${orgSlug}/about`}>About</NavLink>
          </NavItem>
          { isLoggedIn ? (
            <UncontrolledDropdown nav>
              <DropdownToggle nav caret>
                <ViewerName />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem>
                  <NavLink tag={Link} to={`/${orgSlug}/profile`}>Profile</NavLink>
                </DropdownItem>
                <DropdownItem>
                  <NavLink onClick={logout} href="#">Logout</NavLink>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          ) : (
            <NavItem>
              <NavLink onClick={login} href="#">Login</NavLink>
            </NavItem>
          )}
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export default RealitiesNavbar;
