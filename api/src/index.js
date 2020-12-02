import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import Keycloak from 'keycloak-connect';
import { KeycloakContext, KeycloakSubscriptionContext, KeycloakSubscriptionHandler } from 'keycloak-connect-graphql';
import platoCore from 'plato-core';
import createDriver from './db/neo4jDriver';
import schema from './graphql/schema';
import startSchedulers from './services/scheduler';

const { db: { getConnection, getModels } } = platoCore;

// Max listeners for a pub/sub
require('events').EventEmitter.defaultMaxListeners = 15;

const { NODE_ENV, PORT } = process.env;
const API_PORT = NODE_ENV && NODE_ENV.includes('prod') ? PORT || 3000 : 3100;
const app = express();

if (!NODE_ENV || NODE_ENV.includes('dev')) {
  app.use(cors());
}

const keycloak = new Keycloak({}, {
  realm: process.env.KEYCLOAK_REALM,
  'auth-server-url': process.env.KEYCLOAK_SERVER_URL,
  'ssl-required': 'external',
  resource: process.env.KEYCLOAK_CLIENT,
  'public-client': true,
  'confidential-port': 0,
});

app.use('/graphql', keycloak.middleware());

async function createContext(kauth, orgSlug, neo4jDriver) {
  const coreDb = await getConnection(process.env.MONGO_URL);
  const coreModels = getModels(coreDb);
  const userId = kauth.accessToken && kauth.accessToken.content.sub;

  const viewedOrg = await coreModels.Organization.findOne({
    subdomain: orgSlug,
  });
  const viewedOrgId = viewedOrg.id;

  // if we get a result back, it means that the user is a member of the org
  const orgMembership = await coreModels.OrgMember.findOne({
    userId,
    organizationId: viewedOrgId,
  });

  return {
    kauth,
    user: {
      email: kauth.accessToken && kauth.accessToken.content.email,
      role: 'user',
      isMemberOfViewedOrg: (orgMembership && orgMembership.organizationId) === viewedOrgId,
    },
    viewedOrgId,
    driver: neo4jDriver,
  };
}

const keycloakSubscriptionHandler = new KeycloakSubscriptionHandler({ keycloak, protect: false });

createDriver().then((neo4jDriver) => {
  const server = new ApolloServer({
    schema,
    subscriptions: {
      onConnect: async (connectionParams) => {
        const { orgSlug } = connectionParams;

        const token = await keycloakSubscriptionHandler.onSubscriptionConnect(connectionParams);
        const kauth = new KeycloakSubscriptionContext(token);

        return createContext(kauth, orgSlug, neo4jDriver);
      },
    },
    context: async ({ req, connection }) => {
      if (req) {
        const kauth = new KeycloakContext({ req });

        // TODO: get from header instead
        const referer = req.get('referer');

        const refererUrl = new URL(referer);
        const orgSlugMatch = refererUrl.pathname.match(/[^/]+/);
        const orgSlug = orgSlugMatch ? orgSlugMatch[0] : '';

        return createContext(kauth, orgSlug, neo4jDriver);
      }
      return connection.context;
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
});
