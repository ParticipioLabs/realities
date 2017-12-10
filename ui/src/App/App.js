import React from 'react';
import { ApolloProvider } from 'react-apollo';
import apolloClient from '@/services/apolloClient';
import RoutesContainer from './components/RoutesContainer';

const App = () => (
  <ApolloProvider client={apolloClient}>
    <RoutesContainer />
  </ApolloProvider>
);

export default App;
