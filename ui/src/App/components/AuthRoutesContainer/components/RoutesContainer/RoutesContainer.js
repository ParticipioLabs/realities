import React from 'react';
import {
  Router,
  Route,
  Switch,
} from 'react-router-dom';
import styled from 'styled-components';
import history from '@/services/history';
import Home from '@/scenes/Home';
import About from '@/scenes/About';
import RealitiesNavbar from './components/RealitiesNavbar';

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
          <RealitiesNavbar />
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

export default RoutesContainer;
