import { useAuth as useOidc } from 'oidc-react';
import { getOrgSlug } from 'services/location';

export default function useAuth() {
  const auth = useOidc();

  const redirect = `${process.env.REACT_APP_KEYCLOAK_CALLBACK_URL}?orgSlug=${getOrgSlug()}`;

  const accessToken = auth.userData && auth.userData.access_token;
  window.sessionStorage.setItem('accessToken', accessToken);

  return {
    login: () => auth.signIn({ redirect_uri: redirect }),
    logout: () => auth.signOutRedirect({ post_logout_redirect_uri: redirect }),
    isLoggedIn: auth.userData !== null, /* && auth.userData.expired === false
    this kicks in after a bit but you're still logged in after a refresh?? */
    accessToken,
    email: auth.userData && auth.userData.profile.email,
  };
}
