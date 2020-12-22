import { useAuth as useOidc } from 'oidc-react';
import { useOrgSlug, useAtHome } from 'services/location';

export default function useAuth() {
  const auth = useOidc();
  const atHome = useAtHome();
  const orgSlug = useOrgSlug();

  const redirectTo = atHome ? 'home' : 'org';
  // this can also be 'silent' but that's set when setting up the AuthProvider

  const redirect = `${process.env.REACT_APP_KEYCLOAK_CALLBACK_URL}?redirectTo=${redirectTo}&orgSlug=${orgSlug}`;

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
