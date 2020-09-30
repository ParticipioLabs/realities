import React from 'react';
import { ApolloProvider } from '@apollo/client';
import apolloClient from '@/services/apolloClient';
import AuthRoutesContainer from './components/AuthRoutesContainer';

const App = () => (
  <ApolloProvider client={apolloClient}>
    <AuthRoutesContainer />
  </ApolloProvider>
);

export default App;
