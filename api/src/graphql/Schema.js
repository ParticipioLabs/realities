import {GraphQLSchema} from 'graphql';
import QueryType from './types/QueryType';

export default new GraphQLSchema({
  query: QueryType,
});
