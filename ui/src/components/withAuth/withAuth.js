import React, { useState, useEffect } from 'react';
import useAuth from '@/services/auth';

export default (WrappedComponent) => {
  const EnhancedComponent = (props) => {
    const auth = useAuth();

    const getAuthProps = () => ({
      login: auth.login,
      logout: auth.logout,
      isLoggedIn: auth.isLoggedIn(),
      email: auth.getEmail(),
    });

    const [authProps, setAuthProps] = useState(getAuthProps());

    const handleChange = () => {
      setAuthProps(getAuthProps());
    };

    useEffect(() => {
      auth.subscribe(handleChange);

      return () => {
        auth.unsubscribe(handleChange);
      };
    });

    return <WrappedComponent {...props} auth={authProps} />;
  };

  const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  EnhancedComponent.displayName = `WithAuth(${wrappedComponentName})`;

  return EnhancedComponent;
};
