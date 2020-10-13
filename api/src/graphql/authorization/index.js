import { skip, combineResolvers } from 'graphql-resolvers';

// eslint-disable-next-line arrow-body-style
export const isAuthenticated = (obj, args, { user }) => {
  return (user && user.role) ? skip : new Error("User isn't authenticated");
};

export const isAdmin = combineResolvers(
  isAuthenticated,
  (obj, args, { user }) => { // eslint-disable-line arrow-body-style
    return (user && user.role === 'admin') ? skip : new Error('Not authorized');
  },
);

export const isAuthorized = combineResolvers(
  isAuthenticated,
  (obj, args, { user }) => {
    if (user.tenantId === 'placeholder') {
      return skip;
    }
    return new Error('Unauthorized access');
  },
);
