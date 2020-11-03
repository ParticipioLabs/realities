import React from 'react';
import useAuth from 'services/useAuth';

export default (WrappedComponent) => {
  const EnhancedComponent = (props) => {
    const auth = useAuth();

    return <WrappedComponent {...props} auth={auth} />;
  };

  const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  EnhancedComponent.displayName = `WithAuth(${wrappedComponentName})`;

  return EnhancedComponent;
};
