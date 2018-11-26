import path from 'path';
import express from 'express';
import cors from 'cors';

import { createServer } from 'http';
import { ApolloServer } from 'apollo-server-express';
import expressJwt from 'express-jwt';
import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';
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

const jwksOptions = {
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: 'https://theborderland.eu.auth0.com/.well-known/jwks.json',
};

const jwksClient = jwksRsa(jwksOptions);

app.use(expressJwt({
  credentialsRequired: false,
  // Dynamically provide a signing key based on the kid in the header
  // and the singing keys provided by the JWKS endpoint
  secret: jwksRsa.expressJwtSecret(jwksOptions),
}));

function getUser(user) {
  if (!user) return null;
  return Object.assign(
    {},
    user,
    {
      email: user['https://realities.theborderland.se/email'],
      role: user['https://realities.theborderland.se/role'],
    },
  );
}

async function verifyToken(authToken) {
  return new Promise((resolve, reject) => {
    const dtoken = jwt.decode(authToken, { complete: true });
    jwksClient.getSigningKey(dtoken.header.kid, (signError, key) => {
      if (signError) {
        reject(signError);
      } else {
        jwt.verify(authToken, key.publicKey || key.rsaPublicKey, (verifyError, decoded) => {
          if (verifyError) {
            reject(verifyError);
          } else {
            resolve(getUser(decoded));
          }
        });
      }
    });
  });
}

const server = new ApolloServer({
  schema,
  subscriptions: {
    onConnect: async (connectionParams) => {
      if (connectionParams.authToken) {
        return verifyToken(connectionParams.authToken)
          .then(user => ({ user }));
      }

      throw new Error('Missing auth token!');
    },
  },
  context: async ({ req, connection }) => ({
    user: connection ? getUser(connection.user) : getUser(req.user),
    driver: neo4jDriver,
  }),
  tracing: true,
});
server.applyMiddleware({ app, path: '/graphql' });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

// Serve static frontend files.
// NOTE: Temporary solution. Remove this once we deploy static files to its own place
// to decrease coupling between backend and frontend code.
app.use(express.static(path.resolve(__dirname, '../../ui/build')));
app.use((req, res) => res.sendFile(path.resolve(__dirname, '../../ui/build/index.html')));

httpServer.listen(API_PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${API_PORT}/graphql`);
  console.log(`View GraphQL Playground at http://localhost:${API_PORT}/graphql`);
});

// Start the schedulers that download data from various APIs.
startSchedulers();
