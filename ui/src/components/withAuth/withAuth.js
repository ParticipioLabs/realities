import React from 'react';
import useAuth from '@/services/useAuth';

export default (WrappedComponent) => {
  const EnhancedComponent = (props) => {
    const auth = useAuth();

    const authProps = {
      login: auth.login,
      logout: auth.logout,
      isLoggedIn: auth.isLoggedIn,
      email: auth.email,
      auth,
    };

    return <WrappedComponent {...props} auth={authProps} />;
  };

  const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  EnhancedComponent.displayName = `WithAuth(${wrappedComponentName})`;

  return EnhancedComponent;
};
