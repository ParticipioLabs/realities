import { useAuth as useOidc } from 'oidc-react';

export default function useAuth() {
  const auth = useOidc();

  return {
    login: auth.signIn,
    logout: auth.signOutRedirect,
    isLoggedIn: auth.userData !== null,
    accessToken: auth.userData && auth.userData.access_token,
    email: auth.userData && auth.userData.profile.email,
  };
}
