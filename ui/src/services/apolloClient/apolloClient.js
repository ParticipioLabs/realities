import { ApolloClient } from 'apollo-client';
import { withClientState } from 'apollo-link-state';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import auth from '@/services/auth';
import { resolvers, defaults } from './localState';
import introspectionQueryResultData from './fragmentTypes.json';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

const cache = new InMemoryCache({
  dataIdFromObject: object => `${object.__typename}:${object.nodeId}`,
  fragmentMatcher,
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

const client = new ApolloClient({
  cache,
  link: ApolloLink.from([stateLink, authMiddleware, httpLink]),
});

client.onResetStore(stateLink.writeDefaults);

export default client;
