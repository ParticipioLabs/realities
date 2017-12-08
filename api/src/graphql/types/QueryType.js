import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import NeedType from './NeedType';
import mockData from '../../data/mockData';

export default new GraphQLObjectType({
  name: 'Query',
  fields: {
    hello: {
      type: GraphQLString,
      resolve() {
        return 'borderland';
      },
    },
    need: {
      type: NeedType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, { id }) {
        return mockData.needs.find(need => need.id === id);
      },
    },
    needs: {
      type: new GraphQLList(NeedType),
      resolve() {
        return mockData.needs;
      },
    },
  },
});
