import React from 'react';
import { AuthProvider, UserManager } from 'oidc-react';
import Oidc, { WebStorageStateStore } from 'oidc-client';
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

const redirectUri = process.env.REACT_APP_KEYCLOAK_CALLBACK_URL;

// we create our own userManager to store user data in localStorage instead
// of in sessionStorage
// https://github.com/bjerkio/oidc-react/issues/332#issuecomment-723642762
// arguments from
// https://github.com/bjerkio/oidc-react/blob/53c5adef53fe2603bd8507bb27fd3616fbd7e7c1/src/AuthContext.tsx#L46
const userManager = new UserManager({
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  authority: `${process.env.REACT_APP_KEYCLOAK_SERVER_URL}/realms/${process.env.REACT_APP_KEYCLOAK_REALM}`,
  client_id: process.env.REACT_APP_KEYCLOAK_CLIENT,
  redirect_uri: redirectUri,
  silent_redirect_uri: redirectUri,
  post_logout_redirect_uri: redirectUri,
  response_type: 'code',
  scope: 'openid',
  loadUserInfo: true,
  automaticSilentRenew: true,
});

// TODO: remove these loggers
userManager.events.addSilentRenewError((err) => {
  console.log('silent renew error', err);
});
Oidc.Log.logger = console;

const App = () => (
  <AuthProvider
    autoSignIn={false}
    userManager={userManager}
  >
    <ApolloSetup />
  </AuthProvider>
);

export default App;
