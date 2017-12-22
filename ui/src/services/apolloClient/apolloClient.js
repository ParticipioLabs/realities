import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink, concat } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import auth from '@/services/auth';

const options = {};
if (!process.env.NODE_ENV || process.env.NODE_ENV.includes('dev')) {
  options.uri = 'http://localhost:3100/graphql';
}

const httpLink = new HttpLink(options);

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

export default new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache: new InMemoryCache(),
});
