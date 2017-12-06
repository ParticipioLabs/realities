import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

function Hello({ data }) {
  return <div>Hello {data.hello}</div>;
}

Hello.propTypes = {
  data: PropTypes.shape({
    hello: PropTypes.string,
  }).isRequired,
};

const hello = gql`
  query {
    hello
  }
`;

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (Hello)
export default graphql(hello)(Hello);
