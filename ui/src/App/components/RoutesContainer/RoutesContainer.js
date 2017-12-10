import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';
import {
  Alert,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import Home from '@/scenes/Home';
import About from '@/scenes/About';

const RoutesContainer = () => (
  <Router>
    <div>
      <Alert color="primary">
        We have Bootstrap 4!
      </Alert>
      <Navbar color="faded" light expand="md">
        <NavbarBrand tag={Link} to="/">Realities Platform</NavbarBrand>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink tag={Link} to="/about">About</NavLink>
          </NavItem>
        </Nav>
      </Navbar>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
    </div>
  </Router>
);

export default RoutesContainer;
