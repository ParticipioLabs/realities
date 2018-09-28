import React from 'react';
import PropTypes from 'prop-types';
import {
  Router,
  Route,
  Link,
  Switch,
} from 'react-router-dom';
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
import styled from 'styled-components';
import history from '@/services/history';
import Home from '@/scenes/Home';
import About from '@/scenes/About';
import withAuth from '@/components/withAuth';

const RealitiesNavbarBrand = styled(NavbarBrand)`
  text-shadow: 0px 1px #fff, 0px -1px #666;
  text-transform: uppercase;
  font-size: 2.5em;
  font-weight: bold;
`;

const RealitiesFooter = styled.footer`
  margin-top: 2rem;
`;

class RoutesContainer extends React.Component {
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
      <Router history={history}>
        <div>
          <Navbar color="faded" light expand="md">
            <RealitiesNavbarBrand tag={Link} to="/">Realities</RealitiesNavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
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
          <Switch>
            <Route exact path="/about" component={About} />
            <Route path="/:needId?/:responsibilityId?" component={Home} />
          </Switch>
          <RealitiesFooter className="text-muted">
            A tool for tribal decentralised organisations.
          </RealitiesFooter>
        </div>
      </Router>
    );
  }
}

RoutesContainer.defaultProps = {
  auth: {
    isLoggedIn: false,
    email: 'example@example.com',
    login: () => null,
    logout: () => null,
  },
};

RoutesContainer.propTypes = {
  auth: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
    email: PropTypes.string,
    login: PropTypes.func,
    logout: PropTypes.func,
  }),
};

export default withAuth(RoutesContainer);
