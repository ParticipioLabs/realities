import { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';

export default function useAuth() {
  const { keycloak, initialized } = useKeycloak();
  const [email, setEmail] = useState('');

  useEffect(() => {
    setEmail(keycloak.tokenParsed && keycloak.tokenParsed.email);
  });

  // TODO: figure out the reactivity here
  // https://github.com/react-keycloak/react-keycloak/issues/116

  return {
    login: () => {
      keycloak.login({
        redirectUri: process.env.REACT_APP_KEYCLOAK_CALLBACK_URL,
      });
    },
    logout: () => {
      keycloak.logout({
        redirectUri: process.env.REACT_APP_KEYCLOAK_CALLBACK_URL,
      });
    },
    isLoggedIn:
      keycloak.authenticated,
    accessToken:
      keycloak.token,
    email,
    initialized,
  };
}
