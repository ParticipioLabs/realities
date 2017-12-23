import React from 'react';
import PropTypes from 'prop-types';
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
import Home from '@/scenes/Home';
import About from '@/scenes/About';
import withAuth from '@/components/withAuth';

const RealitiesNavbarBrand = styled(NavbarBrand)`
  text-shadow: 0px 1px #fff, 0px -1px #666;
  text-transform: uppercase;
  font-size: 2.75em;
  font-weight: bold;
`;

const RoutesContainer = props => (
  <Router history={history}>
    <div>
      <Navbar color="faded" light expand="md">
        <RealitiesNavbarBrand tag={Link} to="/">Realities Platform</RealitiesNavbarBrand>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink tag={Link} to="/about">About</NavLink>
          </NavItem>
          <NavItem>
            {props.auth.isLoggedIn ? (
              <NavLink onClick={props.auth.logout} href="#">Logout</NavLink>
            ) : (
              <NavLink onClick={props.auth.login} href="#">Login</NavLink>
            )}
          </NavItem>
        </Nav>
      </Navbar>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
    </div>
  </Router>
);

RoutesContainer.defaultProps = {
  auth: {
    isLoggedIn: false,
    login: () => null,
    logout: () => null,
  },
};

RoutesContainer.propTypes = {
  auth: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
    login: PropTypes.func,
    logout: PropTypes.func,
  }),
};

export default withAuth(RoutesContainer);
