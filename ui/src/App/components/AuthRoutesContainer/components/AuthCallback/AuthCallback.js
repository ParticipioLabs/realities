import React, { Component } from 'react';
import Loader from 'react-loader';
import auth from '@/services/auth';

class AuthCallback extends Component {
  componentWillMount() {
    auth.handleAuthentication();
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
