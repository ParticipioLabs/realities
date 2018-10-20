import React, { Component } from 'react';
import gql from 'graphql-tag';
import Loader from 'react-loader';
import auth from '@/services/auth';
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

class AuthCallback extends Component {
  componentWillMount() {
    auth.handleAuthentication().then(({ email }) => {
      apolloClient
        .query({ query: GET_VIEWER, variables: { email } })
        .then(({ data }) => {
          if (data.person) {
            history.replace('/');
          } else {
            apolloClient
              .mutate({ mutation: CREATE_VIEWER })
              .then(() => history.replace('/profile'))
              .catch(err => console.log(err));
          }
        })
        .catch(err => console.log(err));
    });
  }

  render() {
    return (
      <Loader
        options={{
          color: '#aaa',
          length: 20,
          radius: 20,
          width: 8,
        }}
      />
    );
  }
}

export default AuthCallback;
