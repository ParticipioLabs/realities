import { useEffect } from 'react';
import { useAuth as useOidc } from 'oidc-react';

export default function useAuth() {
  const auth = useOidc();

  // const [email, setEmail] = useState('');

  console.log('oidc', auth);
  console.log('session state', auth.session_state);

  useEffect(() => {
    // setEmail('test@test.com');
    // setEmail(keycloak.tokenParsed && keycloak.tokenParsed.email);
  });

  // TODO: figure out the reactivity here
  // https://github.com/react-keycloak/react-keycloak/issues/116

  return {
    login: () => {
      auth.signIn();
      // keycloak.login({
      //   redirectUri: process.env.REACT_APP_KEYCLOAK_CALLBACK_URL,
      // });
    },
    logout: () => {
      auth.signOut();
      // keycloak.logout({
      //   redirectUri: process.env.REACT_APP_KEYCLOAK_CALLBACK_URL,
      // });
    },
    isLoggedIn: auth.userData !== null,
    // keycloak.authenticated,
    accessToken: auth.userData && auth.userData.access_token,
    // keycloak.token,
    email: auth.userData && auth.userData.profile.email,
    // initialized,
  };
}
