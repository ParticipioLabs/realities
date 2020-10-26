import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import Keycloak from 'keycloak-connect';
import { KeycloakContext } from 'keycloak-connect-graphql';
import neo4jDriver from './db/neo4jDriver';
import schema from './graphql/schema';
import startSchedulers from './services/scheduler';

// Max listeners for a pub/sub
require('events').EventEmitter.defaultMaxListeners = 15;

const { NODE_ENV, PORT } = process.env;
const API_PORT = NODE_ENV && NODE_ENV.includes('prod') ? PORT || 3000 : 3100;
const app = express();

if (!NODE_ENV || NODE_ENV.includes('dev')) {
  app.use(cors());
}

const keycloak = new Keycloak({}, {
  realm: 'plato',
  'auth-server-url': 'https://auth.platoproject.org/auth/',
  'ssl-required': 'external',
  resource: 'realities',
  'public-client': true,
  'confidential-port': 0,
});

app.use('/graphql', keycloak.middleware());

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const kauth = new KeycloakContext({ req });

    return {
      kauth,
      user: {
        email: kauth.accessToken && kauth.accessToken.content.email,
        role: kauth.accessToken && 'user',
        // TODO: put the user's tenantId here
      },
      driver: neo4jDriver,
    };
  },
  tracing: true,
});
server.applyMiddleware({ app, path: '/graphql' });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(API_PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${API_PORT}/graphql`);
  console.log(`View GraphQL Playground at http://localhost:${API_PORT}/graphql`);
});

// Start the schedulers that download data from various APIs.
startSchedulers();
