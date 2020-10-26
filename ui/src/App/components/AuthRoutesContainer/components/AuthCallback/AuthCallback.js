import React, { useEffect } from 'react';
import { gql } from '@apollo/client';
import Loader from 'react-loader';
import useAuth from '@/services/useAuth';
import apolloClient from '@/services/apolloClient';
import history from '@/services/history';

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
    initialized, isLoggedIn, getEmail, getAccessToken,
  } = useAuth();

  console.log('outside inited', initialized);
  console.log('outside loggedin', isLoggedIn);
  useEffect(() => {
    if (initialized && isLoggedIn) {
      const client = apolloClient(getAccessToken());
      const email = getEmail();

      client
        .query({ query: GET_VIEWER, variables: { email } })
        .then(({ data }) => {
          if (data.person) {
            history.replace('/');
          } else {
            client
              .mutate({ mutation: CREATE_VIEWER })
              .then(() => history.replace('/profile'))
              .catch(err => console.log(err));
          }
        })
        .catch(err => console.log(err));
    }
  });

  return (
    <div>
      <div>
        {(() => {
          console.log('inrender inited', initialized);
          if (initialized) {
            return 'inited';
          }
          return 'NOT';
        })()}
      </div>
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
