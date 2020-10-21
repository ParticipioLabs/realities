import React from 'react';
import Keycloak from 'keycloak-js';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import useAuth from '@/services/useAuth';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '@/services/apolloClient';
import AuthRoutesContainer from './components/AuthRoutesContainer';

const keycloak = Keycloak({
  realm: 'plato',
  // 'auth-server-url': 'https://auth.platoproject.org/auth/',
  url: 'https://auth.platoproject.org/auth/',
  'ssl-required': 'external',
  // resource: 'realities',
  'public-client': true,
  'confidential-port': 0,
  clientId: 'realities',
});

const eventLogger = (event, error) => {
  console.log('onKeycloakEvent', event, error);
};

const ApolloSetup = () => {
  const { getAccessToken } = useAuth();
  console.log('token', getAccessToken());

  return (
    <ApolloProvider client={apolloClient(getAccessToken())}>
      <AuthRoutesContainer />
    </ApolloProvider>
  );
};

const App = () => (
  <ReactKeycloakProvider
    authClient={keycloak}
    onEvent={eventLogger}
    initOptions={{
      // https://www.keycloak.org/docs/latest/securing_apps/index.html#_modern_browsers
      silentCheckSsoFallback: false,
      silentCheckSsoRedirectUri: process.env.REACT_APP_KEYCLOAK_CALLBACK_URL,
    }}
  >
    <ApolloSetup />
  </ReactKeycloakProvider>
);

export default App;
