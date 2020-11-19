import { useAuth as useOidc } from 'oidc-react';
import { useRouteMatch } from 'react-router-dom';
import _ from 'lodash';

export default function useAuth() {
  const auth = useOidc();
  const match = useRouteMatch('/:orgSlug');
  const orgSlug = _.get(match, 'params.orgSlug', '');

  const redirect = `${process.env.REACT_APP_KEYCLOAK_CALLBACK_URL}?orgSlug=${orgSlug}`;

  return {
    login: () => auth.signIn({ redirect_uri: redirect }),
    logout: () => auth.signOutRedirect({ post_logout_redirect_uri: redirect }),
    isLoggedIn: auth.userData !== null && auth.userData.expired === false,
    accessToken: auth.userData && auth.userData.access_token,
    email: auth.userData && auth.userData.profile.email,
  };
}
