import React from 'react';
import {
  Router,
  Route,
  Link,
} from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import styled from 'styled-components';
import history from '@/services/history';
import auth from '@/services/auth';
import Home from '@/scenes/Home';
import About from '@/scenes/About';
import AuthCallback from '@/scenes/AuthCallback';

const RealitiesNavbarBrand = styled(NavbarBrand)`
  text-shadow: 0px 1px #fff, 0px -1px #666;
  text-transform: uppercase;
  font-size: 2.75em;
  font-weight: bold;
`;

const RoutesContainer = () => (
  <Router history={history}>
    <div>
      <Navbar color="faded" light expand="md">
        <RealitiesNavbarBrand tag={Link} to="/">Realities Platform</RealitiesNavbarBrand>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink tag={Link} to="/about">About</NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={auth.login} href="#">Login</NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={auth.logout} href="#">Logout</NavLink>
          </NavItem>
        </Nav>
      </Navbar>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/auth-callback" component={AuthCallback} />
    </div>
  </Router>
);

export default RoutesContainer;
