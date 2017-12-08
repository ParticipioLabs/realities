import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import mockData from '../../data/mockData';

const NeedType = new GraphQLObjectType({
  name: 'Need',
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    dependsOn: {
      type: new GraphQLList(NeedType),
      resolve(need) {
        return need.dependsOn.map(id => mockData.needs.find(mockNeed => mockNeed.id === id));
      },
    },
  }),
});

export default NeedType;
