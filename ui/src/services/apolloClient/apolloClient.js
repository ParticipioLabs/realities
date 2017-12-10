import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const options = {};
if (!process.env.NODE_ENV || process.env.NODE_ENV.includes('dev')) {
  options.uri = 'http://localhost:3100/graphql';
}

export default new ApolloClient({
  link: new HttpLink(options),
  cache: new InMemoryCache(),
});
