import React from 'react';
import App from '../components/App';
import Home from '../components/Home';
import withData from '../lib/withData';
import SearchResultList from '../components/SearchResultList';

export default withData(() => (
  <App>
    <Home />
  </App>
));
