// local resolvers are deprecated (but we don't seem to be using them anyway)
// read more about local state here
// https://www.apollographql.com/docs/react/local-state/local-state-management/
export const resolvers = {
  Query: {},
  Mutation: {},
};

export const defaults = {
  showCreateNeed: false,
  showCreateResponsibility: false,
  showDetailedEditView: false,
};
