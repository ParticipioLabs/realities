import path from 'path';
import { makeExecutableSchema } from 'graphql-tools';
import { neo4jgraphql } from 'neo4j-graphql-js';
import express from 'express';
import cors from 'cors';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import neo4jDriver from './db/neo4jDriver';

const typeDefs = `
type Person {
  nodeId: ID!
  name: String!
  email: String!
  guidesNeed: [Need] @relation(name: "GUIDES", direction: "OUT")
  realizesNeed: [Need] @relation(name: "REALIZES", direction: "OUT")
  guidesResponsibility: [Responsibility] @relation(name: "GUIDES", direction: "OUT")
  realizesResponsibility: [Responsibility] @relation(name: "REALIZES", direction: "OUT")
}

type Need {
  nodeId: ID!
  title: String!
  description: String
  guide: Person @relation(name: "GUIDES", direction: "IN")
  realizer: Person @relation(name: "REALIZES", direction: "IN")
  fulfilledBy: [Responsibility] @relation(name: "FULFILLS", direction: "IN")
  dependsOnNeeds: [Need] @relation(name: "DEPENDS_ON", direction: "OUT")
  dependsOnResponsibilites: [Responsibility] @relation(name: "DEPENDS_ON", direction: "OUT")
  needsThatDependOnThis: [Need] @relation(name: "DEPENDS_ON", direction: "IN")
  responsibilitiesThatDependOnThis: [Responsibility] @relation(name: "DEPENDS_ON", direction: "IN")
}

type Responsibility {
  nodeId: ID!
  title: String!
  description: String
  guide: Person @relation(name: "GUIDES", direction: "IN")
  realizer: Person @relation(name: "REALIZES", direction: "IN")
  fulfills: Need @relation(name: "FULFILLS", direction:"OUT")
  dependsOnNeeds: [Need] @relation(name: "DEPENDS_ON", direction: "OUT")
  dependsOnResponsibilites: [Responsibility] @relation(name: "DEPENDS_ON", direction: "OUT")
  needsThatDependOnThis: [Need] @relation(name: "DEPENDS_ON", direction: "IN")
  responsibilitiesThatDependOnThis: [Responsibility] @relation(name: "DEPENDS_ON", direction: "IN")
}

type Query {
  persons: [Person]
  responsibilities: [Responsibility]
  needs: [Need]
}

type Mutation {
  createNeed(title: String!): Need
}
`;

let driver;

const context = (user) => {
  if (!driver) {
    driver = neo4jDriver;
  }
  return {
    driver,
    user,
  };
};

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
  Mutation: {
    createNeed(_, params) {
      const session = driver.session();
      const query = `MERGE (need:Need {title:{title}} )
        WITH (need)
        SET need.nodeId = ID(need)
        RETURN need`;

      return session.run(query, params)
        .then((result) => {
          session.close();
          const singleRecord = result.records[0];
          const need = singleRecord.get(0);
          return need.properties;
        }).catch((error) => {
          console.log(error);
        });
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const { NODE_ENV, PORT } = process.env;
const API_PORT = NODE_ENV && NODE_ENV.includes('prod') ? PORT || 3000 : 3100;
const app = express();

if (!NODE_ENV || NODE_ENV.includes('dev')) {
  app.use(cors());
}

app.use(jwt({
  credentialsRequired: false,
  // Dynamically provide a signing key based on the kid in the header
  // and the singing keys provided by the JWKS endpoint
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://theborderland.eu.auth0.com/.well-known/jwks.json',
  }),
}));

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(req => ({
    schema,
    context: context(req.user),
  })),
);

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// Serve static frontend files.
// NOTE: Temporary solution. Remove this once we deploy static files to its own place
// to decrease coupling between backend and frontend code.
app.use(express.static(path.resolve(__dirname, '../../ui/build')));
app.use((req, res) => res.sendFile(path.resolve(__dirname, '../../ui/build/index.html')));

app.listen(API_PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${API_PORT}/graphql`);
  console.log(`View GraphiQL at http://localhost:${API_PORT}/graphiql`);
});
