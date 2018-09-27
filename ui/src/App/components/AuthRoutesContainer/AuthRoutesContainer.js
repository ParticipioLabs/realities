import React from 'react';
import {
  Router,
  Route,
  Switch,
} from 'react-router-dom';
import history from '@/services/history';
import AuthCallback from './components/AuthCallback';
import RoutesContainer from './components/RoutesContainer';


const AuthRoutesContainer = () => (
  <Router history={history}>
    <Switch>
      <Route exact path="/auth-callback" component={AuthCallback} />
      <Route path="/" component={RoutesContainer} />
    </Switch>
  </Router>
);

export default AuthRoutesContainer;
