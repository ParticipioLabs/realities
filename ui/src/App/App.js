import React from 'react';
import { AuthProvider } from 'oidc-react';
import useAuth from '@/services/useAuth';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '@/services/apolloClient';
import AuthRoutesContainer from './components/AuthRoutesContainer';

// const keycloak = Keycloak({
//   realm: process.env.REACT_APP_KEYCLOAK_REALM,
//   url: process.env.REACT_APP_KEYCLOAK_SERVER_URL,
//   'ssl-required': 'external',
//   'public-client': true,
//   'confidential-port': 0,
//   clientId: process.env.REACT_APP_KEYCLOAK_CLIENT,
// });

const ApolloSetup = () => {
  const { accessToken } = useAuth();

  return (
    <ApolloProvider client={apolloClient(accessToken)}>
      <AuthRoutesContainer />
    </ApolloProvider>
  );
};

const App = () => (
  <AuthProvider
    authority={`${process.env.REACT_APP_KEYCLOAK_SERVER_URL}/realms/${process.env.REACT_APP_KEYCLOAK_REALM}`}
    clientId={process.env.REACT_APP_KEYCLOAK_CLIENT}
    redirectUri={process.env.REACT_APP_KEYCLOAK_CALLBACK_URL}
  >
    <ApolloSetup />
  </AuthProvider>
);

export default App;
