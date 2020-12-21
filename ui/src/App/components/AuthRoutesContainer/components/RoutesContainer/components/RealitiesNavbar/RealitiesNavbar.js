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
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { FaChevronLeft } from 'react-icons/fa';
import useAuth from 'services/useAuth';
import { useOrgSlug } from 'services/location';
import Search from 'components/Search';
import ViewerName from 'components/ViewerName';
import IconButton from 'components/IconButton';

const StyledNavbarBrand = styled(NavbarBrand)`
  font-weight: bold;
`;

const RealitiesNavbar = () => {
  const history = useHistory();
  const orgSlug = useOrgSlug();

  const [isOpen, setIsOpen] = useState(false);

  const {
    isLoggedIn, login, logout,
  } = useAuth();

  const atHome = window.location.pathname === '/';

  return (
    <Navbar color="faded" light expand="md">
      <IconButton
        dark
        style={{ visibility: atHome ? 'hidden' : '' }}
        onClick={() => history.push('/')}
      >
        <FaChevronLeft />
      </IconButton>
      <StyledNavbarBrand tag={Link} to={`/${orgSlug}`}>
        Realities
      </StyledNavbarBrand>
      <div className="flex-grow-1 mr-3 d-none d-md-block ">
        { atHome ? '' : (
          <Search />
        )}
      </div>
      <NavbarToggler onClick={() => setIsOpen(!isOpen)} />
      <Collapse isOpen={isOpen} navbar className="flex-grow-0">
        <Nav className="ml-auto" navbar>
          {atHome ? '' : (
            <>
              <NavItem>
                <NavLink tag={Link} to={`/${orgSlug}/graph`}>Graph</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to={`/${orgSlug}/about`}>About</NavLink>
              </NavItem>
            </>
          )}
          { isLoggedIn ? (
            <UncontrolledDropdown nav>
              <DropdownToggle nav caret>
                <ViewerName />
              </DropdownToggle>
              <DropdownMenu right>
                {atHome ? '' : (
                  <DropdownItem>
                    <NavLink tag={Link} to={`/${orgSlug}/profile`}>Profile</NavLink>
                  </DropdownItem>
                )}
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
