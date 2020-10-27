import { skip, combineResolvers } from 'graphql-resolvers';

// eslint-disable-next-line arrow-body-style
export const isAuthenticated = (obj, args, { kauth }) => {
  return kauth.isAuthenticated() ? skip : new Error("User isn't authenticated");
};

export const isAdmin = combineResolvers(
  isAuthenticated,
  (obj, args, { user }) => { // eslint-disable-line arrow-body-style
    return (user && user.role === 'admin') ? skip : new Error('Not authorized');
  },
);
