import React from 'react';
import App from '../components/App';
import Hello from '../components/Hello';
import withData from '../lib/withData';
import SearchResultList from '../components/SearchResultList';

export default withData(() => (
  <App>
    <Hello />
    <SearchResultList searchResults={[{ title: 'title1', description: 'description1' },
      { title: 'title1', description: 'description1' }]}
    />
  </App>
));
