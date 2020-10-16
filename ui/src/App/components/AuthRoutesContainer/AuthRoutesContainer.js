import React from 'react';
import {
  Router,
  Route,
  Switch,
} from 'react-router-dom';
import Keycloak from 'keycloak-js';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import history from '@/services/history';
import AuthCallback from './components/AuthCallback';
import RoutesContainer from './components/RoutesContainer';

const keycloak = Keycloak({
  realm: 'plato',
  'auth-server-url': 'https://auth.platoproject.org/auth/',
  'ssl-required': 'external',
  resource: 'realities',
  'public-client': true,
  'confidential-port': 0,
  clientId: 'realities',
});

const AuthRoutesContainer = () => (
  <ReactKeycloakProvider authClient={keycloak}>
    <Router history={history}>
      <Switch>
        <Route exact path="/auth-callback" component={AuthCallback} />
        <Route path="/" component={RoutesContainer} />
      </Switch>
    </Router>
  </ReactKeycloakProvider>
);

export default AuthRoutesContainer;
