import React, { useEffect } from 'react';
import { gql } from '@apollo/client';
import Loader from 'react-loader';
import useAuth from 'services/useAuth';
import apolloClient from 'services/apolloClient';
import history from 'services/history';
import { getOrgSlug } from 'services/location';

const GET_VIEWER = gql`
  query AuthCallback_person($email: String!) {
    person(email: $email) {
      nodeId
      email
      name
    }
  }
`;

const CREATE_VIEWER = gql`
  mutation AuthCallback_createViewer {
    createViewer {
      nodeId
      email
    }
  }
`;

const AuthCallback = () => {
  const {
    isLoggedIn, email, accessToken,
  } = useAuth();

  const orgSlug = getOrgSlug();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('state') === null) {
      // if that query param isn't there then the user likely just logged out
      history.replace(`/${orgSlug}`);
    }

    if (isLoggedIn && email) {
      const client = apolloClient(accessToken);

      client
        .query({ query: GET_VIEWER, variables: { email } })
        .then(({ data }) => {
          if (data.person) {
            history.replace(`/${orgSlug}`);
          } else {
            client
              .mutate({ mutation: CREATE_VIEWER })
              .then(() => history.replace(`/${orgSlug}/profile`))
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
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
