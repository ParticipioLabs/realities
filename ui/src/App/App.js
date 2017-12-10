import React from 'react';
import { Alert } from 'reactstrap';
import ExampleReusedComponent from '@/components/ExampleReusedComponent';

const App = () => (
  <div className="App">
    <Alert color="primary">
      We have Bootstrap 4!
    </Alert>
    <h1 className="App-title">Realities Platform</h1>
    <ExampleReusedComponent />
  </div>
);

export default App;
