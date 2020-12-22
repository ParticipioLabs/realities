import React, { useEffect } from 'react';
import { gql } from '@apollo/client';
import Loader from 'react-loader';
import useAuth from 'services/useAuth';
import apolloClient from 'services/apolloClient';
import history from 'services/history';
import { getOrgSlug } from 'services/location';

const CREATE_VIEWER = gql`
  mutation AuthCallback_createViewer {
    createViewer {
      nodeId
      email
      name
    }
  }
`;

const AuthCallback = () => {
  const {
    isLoggedIn, email,
  } = useAuth();

  const orgSlug = getOrgSlug();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    // we have to be careful with grabbing redirects from user input (e.g. urls)
    // https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html
    // so instead of grabbing a url from the url we just use a simple id like this
    const redirectTo = params.get('redirectTo');

    // we don't want to spam this part of the script
    // so we'll just do it when the user manually logs in/out
    if (redirectTo !== 'silent') {
      const baseToUrl = redirectTo === 'home' ? '/' : `/${orgSlug}`;

      if (params.get('state') === null) {
        // if that query param isn't there then the user likely just logged out
        history.replace(baseToUrl);
      }

      // waiting until the user's login is successful
      if (isLoggedIn && email) {
        const client = apolloClient(orgSlug);

        client
          // CREATE_VIEWER is idempotent so it doesn't hurt to call it every time
          .mutate({ mutation: CREATE_VIEWER })
          .then(({ data: { createViewer: { name } } }) => {
            if (name === null) {
              // user hasn't set their name yet, redirect them to their profile
              // to do that
              if (redirectTo === 'home') {
                // TODO: fix the profile screen so we can show it to people who
                // haven't entered an org yet
                history.replace(baseToUrl);
              } else if (redirectTo === 'org') {
                history.replace(`/${orgSlug}/profile`);
              }
            } else {
              history.replace(baseToUrl);
            }
          })
          .catch((err) => console.log(err));
      }
    }
  });

  return (
    <div>
      <Loader
        options={{
          color: '#aaa',
          length: 20,
          radius: 20,
          width: 8,
        }}
      />
    </div>
  );
};

export default AuthCallback;
