import React from 'react';
import ExampleChildComponent from './components/ExampleChildComponent';

const ExampleReusedComponent = () => (
  <div>
    <p>
      Components that are used in several places throughout the code
      go in the src/components directory. Webpack is configured to
      use @ as an alias for the src directory, so you can import components
      using the @/components/ComponentName pattern from anywhere.
    </p>
    <p>
      Example:
      <br />
      {'import ExampleReusedComponent from \'@/components/ExampleReusedComponent\';'}
    </p>
    <ExampleChildComponent />
    <p>
      <a
        href="https://medium.com/@alexmngn/how-to-better-organize-your-react-applications-2fd3ea1920f1"
        target="_blank"
        rel="noopener noreferrer"
      >
        Read more
      </a>
    </p>
  </div>
);

export default ExampleReusedComponent;
