import path from 'path';
import { makeExecutableSchema } from 'graphql-tools';
import { neo4jgraphql } from 'neo4j-graphql-js';
import express from 'express';
import cors from 'cors';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import neo4jDriver from './db/neo4jDriver';

const typeDefs = `
type Person {
  name: String!
  email: String!
  guidesNeed: [Need] @relation(name: "GUIDES", direction: "OUT")
  realizesNeed: [Need] @relation(name: "REALIZES", direction: "OUT")
  guidesResponsibility: [Responsibility] @relation(name: "GUIDES", direction: "OUT")
  realizesResponsibility: [Responsibility] @relation(name: "REALIZES", direction: "OUT")
}

type Need {
  title: String!
  description: String
  guide: Person! @relation(name: "GUIDES", direction: "IN")
  realizer: Person @relation(name: "REALIZES", direction: "IN")
  fulfilledBy: [Responsibility] @relation(name: "FULFILLS", direction: "IN")
  dependsOnNeeds: [Need] @relation(name: "DEPENDS_ON", direction: "OUT")
  dependsOnResponsibilites: [Responsibility] @relation(name: "DEPENDS_ON", direction: "OUT")
}

type Responsibility {
  title: String!
  description: String
  guide: Person! @relation(name: "GUIDES", direction: "IN")
  realizer: Person @relation(name: "REALIZES", direction: "IN")
  fulfills: Need! @relation(name: "FULFILLS", direction:"OUT")
  dependsOnNeeds: [Need] @relation(name: "DEPENDS_ON", direction: "OUT")
  dependsOnResponsibilites: [Responsibility] @relation(name: "DEPENDS_ON", direction: "OUT")
}

type Query {
  persons: [Person]
  responsibilities: [Responsibility]
  needs: [Need]
}
`;

const resolvers = {
  // root entry point to GraphQL service
  Query: {
    persons(object, params, ctx, resolveInfo) {
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
const app = express();

app.use(cors());
app.use(express.static(path.resolve(__dirname, '../../ui/build'))); // Frontend files
app.use('/graphql', bodyParser.json(), graphqlExpress(request => ({ schema, context: context(request.headers, process.env) })));
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.listen(PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${PORT}/graphql`);
  console.log(`View GraphiQL at http://localhost:${PORT}/graphiql`);
});
