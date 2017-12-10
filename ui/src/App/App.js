import React from 'react';
import { Alert } from 'reactstrap';
import RoutesContainer from './components/RoutesContainer';

const App = () => (
  <div>
    <Alert color="primary">
      We have Bootstrap 4!
    </Alert>
    <RoutesContainer />
  </div>
);

export default App;
