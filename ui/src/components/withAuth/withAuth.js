import React, { Component } from 'react';
import auth from '@/services/auth';

export default (WrappedComponent) => {
  function getAuthProps() {
    return {
      login: auth.login,
      logout: auth.logout,
      isLoggedIn: auth.isLoggedIn(),
    };
  }

  class EnhancedComponent extends Component {
    constructor(props) {
      super(props);
      this.state = {
        auth: getAuthProps(),
      };
    }

    componentDidMount() {
      auth.subscribe(this.handleChange);
    }

    componentWillUnmount() {
      auth.unsubscribe(this.handleChange);
    }

    handleChange = () => {
      this.setState({
        auth: getAuthProps(),
      });
    }

    render() {
      return <WrappedComponent auth={this.state.auth} {...this.props} />;
    }
  }

  const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  EnhancedComponent.displayName = `WithAuth(${wrappedComponentName})`;

  return EnhancedComponent;
};
