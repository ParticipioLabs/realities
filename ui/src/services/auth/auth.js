import Auth0 from 'auth0-js';
import store from 'store';
import history from '@/services/history';

const auth0 = new Auth0.WebAuth({
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  clientID: process.env.REACT_APP_AUTH0_CLIENT_ID,
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
  responseType: 'token id_token',
  scope: 'openid email profile',
});

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
        });
        history.replace('/');
      } else if (err) {
        // Handle authentication error, for example by displaying a notification to the user
      }
    });
  },
  getAccessToken: () => {
    const storedAuth = store.get('auth') || {};
    return storedAuth.accessToken;
  },
  logout: () => {
    store.remove('auth');
    // Update redux or something to change the state of the app to unauthed
  },
};
