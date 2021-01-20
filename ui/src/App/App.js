import React, { useEffect } from 'react';
import { Router } from 'react-router-dom';
import history from 'services/history';
import { AuthProvider, UserManager, useAuth as useOidc } from 'oidc-react';
import Oidc from 'oidc-client';
import { ApolloProvider } from '@apollo/client';
import apolloClient from 'services/apolloClient';
import { useOrgSlug } from 'services/location';
import WrappedLoader from 'components/WrappedLoader';
import AuthRoutesContainer from './components/AuthRoutesContainer';

const redirectUri = process.env.REACT_APP_KEYCLOAK_CALLBACK_URL;

// we create our own userManager to store user data in localStorage instead
// of in sessionStorage
// https://github.com/bjerkio/oidc-react/issues/332#issuecomment-723642762
// arguments from
// https://github.com/bjerkio/oidc-react/blob/53c5adef53fe2603bd8507bb27fd3616fbd7e7c1/src/AuthContext.tsx#L46
const userManager = new UserManager({
  // disabling for now
  // https://github.com/Edgeryders-Participio/realities/issues/162
  // userStore: new WebStorageStateStore({ store: window.localStorage }),
  authority: `${process.env.REACT_APP_KEYCLOAK_SERVER_URL}/realms/${process.env.REACT_APP_KEYCLOAK_REALM}`,
  client_id: process.env.REACT_APP_KEYCLOAK_CLIENT,
  redirect_uri: redirectUri,
  silent_redirect_uri: `${redirectUri}?redirectTo=silent`,
  post_logout_redirect_uri: redirectUri,
  response_type: 'code',
  scope: 'openid',
  loadUserInfo: true,
  automaticSilentRenew: true,
});

let prevOrgSlug = null;
let apollo = null;

const ApolloSetup = () => {
  const orgSlug = useOrgSlug();
  const oidc = useOidc();

  // if the user has e.g. logged out in another tab
  useEffect(() => {
    const signedOutHandler = () => {
      console.log('user signed out event');
      oidc.signOut();
    };
    userManager.events.addUserSignedOut(signedOutHandler);
    return () => userManager.events.removeUserSignedOut(signedOutHandler);
  }, [oidc]);

  if (orgSlug === null) return <WrappedLoader />;
  if (orgSlug !== prevOrgSlug) {
    prevOrgSlug = orgSlug;
    apollo = apolloClient(orgSlug);
  }

  return (
    <ApolloProvider client={apollo}>
      <AuthRoutesContainer />
    </ApolloProvider>
  );
};

// To show the user as logged in when they open a new tab and they're already
// logged in
userManager.signinSilent().catch((err) => {
  console.log('silent sign in failed:', err);
});

userManager.events.addSilentRenewError((err) => {
  console.log('silent renew error', err);
});
Oidc.Log.level = Oidc.Log.DEBUG;
// Oidc.Log.logger = console;

const App = () => (
  <Router history={history}>
    <AuthProvider
      autoSignIn={false}
      userManager={userManager}
    >
      <ApolloSetup />
    </AuthProvider>
  </Router>
);

export default App;
