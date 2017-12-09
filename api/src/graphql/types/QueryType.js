import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import neo4j from 'neo4j-driver';
import NeedType from './NeedType';
import PersonType from './PersonType';
import mockData from '../../data/mockData';

const driver = neo4j.driver('bolt://hobby-nfdmkjnckhclgbkeifnhbial.dbs.graphenedb.com:24786', neo4j.auth.basic('realities-dev', 'b.JOosRDbMCr7h.O4fBS2qPIbARuhRo'));
const session = driver.session();

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
    person: {
      type: PersonType,
      resolve() {
        return session
          .run('MATCH (n:Person {name:"Vishnu"}) RETURN n.name')
          .then(function(result) {
              console.log(result.records[0]);
              return result.records[0];
              session.close();
          })
          .catch(function(error) {
              console.log(error);
          });
      }
    }
  },
});