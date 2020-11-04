import React from 'react';
import { AuthProvider } from 'oidc-react';
import useAuth from 'services/useAuth';
import { ApolloProvider } from '@apollo/client';
import apolloClient from 'services/apolloClient';
import AuthRoutesContainer from './components/AuthRoutesContainer';

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
    autoSignIn={false}
  >
    <ApolloSetup />
  </AuthProvider>
);

export default App;
