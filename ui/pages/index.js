import React from 'react';
import App from '../components/App';
import Hello from '../components/Hello';
import withData from '../lib/withData';

export default withData(() => (
  <App>
    <Hello />
  </App>
));
