import { ApolloClient } from 'apollo-client';
import { getMainDefinition } from 'apollo-utilities';
import { withClientState } from 'apollo-link-state';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloLink, split } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import auth from '@/services/auth';
import { resolvers, defaults } from './localState';

const cache = new InMemoryCache({
  dataIdFromObject: object => `${object.__typename}:${object.nodeId}`,
});

const stateLink = withClientState({ cache, resolvers, defaults });

const authMiddleware = new ApolloLink((operation, forward) => {
  const accessToken = auth.getAccessToken();
  if (accessToken) {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
  return forward(operation);
});

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
});

const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_GRAPHQL_SUBSCRIPTION,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: auth.getAccessToken(),
    },
  },
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const terminatingLink = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([stateLink, authMiddleware, terminatingLink]),
});

client.onResetStore(stateLink.writeDefaults);

export default client;
