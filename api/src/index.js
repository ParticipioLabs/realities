import { makeExecutableSchema } from 'graphql-tools';
import { neo4jgraphql } from 'neo4j-graphql-js';
import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import neo4jDriver from './db/neo4jDriver';

const typeDefs = `
type Person {
  name: String
}

type Need {
  title: String
  fulfilledBy: [Responsibility] @relation(name: "FULFILLS", direction: "IN")
}

type Responsibility {
  title: String
  fulfills: Need @relation(name: "FULFILLS", direction:"OUT")
}

type Query {
  allPersons: [Person]
  responsibilities: [Responsibility]
  needs: [Need]
}
`;

const resolvers = {
  // root entry point to GraphQL service
  Query: {
    allPersons(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo);
    },
    responsibilities(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo);
    },
    needs(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo);
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

let driver;

const context = (headers) => {
  if (!driver) {
    driver = neo4jDriver;
  }
  return {
    driver,
    headers,
  };
};

const PORT = 3100;
const server = express();

server.use('/graphql', bodyParser.json(), graphqlExpress(request => ({ schema, context: context(request.headers, process.env) })));

server.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

server.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}/graphql`);
  console.log(`View GraphiQL at http://localhost:${PORT}/graphiql`);
});
