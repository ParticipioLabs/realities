// import Auth0 from 'auth0-js';
import { useKeycloak } from '@react-keycloak/web';
// import store from 'store';
import history from '@/services/history';

// const auth0 = new Auth0.WebAuth({
//   domain: process.env.REACT_APP_AUTH0_DOMAIN,
//   clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
//   audience: process.env.REACT_APP_AUTH0_AUDIENCE,
//   redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
//   responseType: 'token id_token',
//   scope: 'openid email',
// });

let handlers = [];

function fireHandlers() {
  handlers.forEach(fn => fn());
}

export default function useAuth() {
  const { keycloak, initialized } = useKeycloak();

  // TODO: doesn't seem like any of the properties of `keycloak` are actually
  // reactive. so set up some system where we turn e.g. isLoggedIn into a useState

  return {
    login: () => {
      // auth0.authorize({ title: 'Realities' });
      keycloak.login({
        redirectUri: process.env.REACT_APP_KEYCLOAK_CALLBACK_URL,
      });
    },
    handleAuthentication: () => (
      'potato'
      // new Promise((resolve, reject) => {
      //   auth0.parseHash((err, authResult) => {
      //     if (authResult && authResult.accessToken && authResult.idToken) {
      //       const auth = {
      //         accessToken: authResult.accessToken,
      //         idToken: authResult.idToken,
      //         expiresAt: (authResult.expiresIn * 1000) + new Date().getTime(),
      //         email: authResult.idTokenPayload && authResult.idTokenPayload.email,
      //       };
      //       store.set('auth', auth);
      //       fireHandlers();
      //       resolve(auth);
      //     } else {
      //       reject(err);
      //     }
      //   });
      // })
    ),
    logout: () => {
      // store.remove('auth');
      keycloak.logout({
        redirectUri: process.env.REACT_APP_KEYCLOAK_CALLBACK_URL,
      });
      fireHandlers();
      history.push('/');
    },
    isLoggedIn:
      // !!store.get('auth')
      keycloak.authenticated,
    getAccessToken: () =>
      keycloak.token,
    // const storedAuth = store.get('auth') || {};
    // const tokenExpired = storedAuth.expiresAt < new Date().getTime();
    // if (tokenExpired) {
    //   store.remove('auth');
    //   fireHandlers();
    //   return null;
    // }
    // return storedAuth.accessToken;

    getEmail: () => keycloak.tokenParsed && keycloak.tokenParsed.email,
    // TODO: only used in withAuth, we can probably remove this. the hooks
    // should make it reactive enough or?
    subscribe: (fn) => {
      handlers.push(fn);
    },
    unsubscribe: (fn) => {
      handlers = handlers.filter(item => item !== fn);
    },
    keycloak,
    initialized,
  };
}
