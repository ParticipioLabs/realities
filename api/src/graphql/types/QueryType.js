import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { v1 as neo4j } from 'neo4j-driver';
import NeedType from './NeedType';
import PersonType from './PersonType';
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
      resolve(object, { id }) {
        return mockData.needs.find(need => need.id === id);
      },
    },
    needs: {
      type: new GraphQLList(NeedType),
      resolve() {
        return mockData.needs;
      },
    },
    person: {
      type: PersonType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(object, { id }, { neo4jSession }) {
        return neo4jSession
          .run('MATCH (n) WHERE ID(n)={idParam} RETURN n', { idParam: neo4j.int(id) })
          .then((result) => {
            const singleRecord = result.records[0];
            const person = singleRecord.get(0);
            neo4jSession.close();
            return {
              id,
              name: person.properties.name,
            };
          });
      },
    },
  },
});
