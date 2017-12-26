import Auth0 from 'auth0-js';
import store from 'store';
import history from '@/services/history';

const auth0 = new Auth0.WebAuth({
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
  responseType: 'token id_token',
  scope: 'openid email',
});

let handlers = [];

function fireHandlers() {
  handlers.forEach(fn => fn());
}

export default {
  login: () => {
    auth0.authorize({ dict_title: 'Realities' });
  },
  handleAuthentication: () => {
    auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        store.set('auth', {
          accessToken: authResult.accessToken,
          idToken: authResult.idToken,
          expiresAt: (authResult.expiresIn * 1000) + new Date().getTime(),
          email: authResult.idTokenPayload && authResult.idTokenPayload.email,
        });
        fireHandlers();
        history.replace('/');
      } else if (err) {
        // Handle authentication error, for example by displaying a notification to the user
      }
    });
  },
  logout: () => {
    store.remove('auth');
    fireHandlers();
  },
  isLoggedIn: () => !!store.get('auth'),
  getAccessToken: () => {
    const storedAuth = store.get('auth') || {};
    const tokenExpired = storedAuth.expiresAt < new Date().getTime();
    if (tokenExpired) {
      store.remove('auth');
      fireHandlers();
      return null;
    }
    return storedAuth.accessToken;
  },
  getEmail: () => {
    const storedAuth = store.get('auth') || {};
    return storedAuth.email;
  },
  subscribe: (fn) => {
    handlers.push(fn);
  },
  unsubscribe: (fn) => {
    handlers = handlers.filter(item => item !== fn);
  },
};
