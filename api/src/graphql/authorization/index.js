import { skip, combineResolvers } from 'graphql-resolvers';

// eslint-disable-next-line arrow-body-style
export const isAuthenticated = (obj, args, { user: { role } }) => {
  return role ? skip : new Error("User isn't authenticated");
};

export const isAdmin = combineResolvers(
  isAuthenticated,
  (obj, args, { user: { role } }) => { // eslint-disable-line arrow-body-style
    return role === 'admin' ? skip : new Error('Not authorized');
  },
);
