import {
  GraphQLID,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

const PersonType = new GraphQLObjectType({
  name: 'Person',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
  }),
});

export default PersonType;
