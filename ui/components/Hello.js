import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

function Hello({ data }) {
  console.log(data);
  return <div>Hello {data.name}</div>;
}

Hello.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string,
  }).isRequired,
};

const person = gql`
  query {
    person {
      name
    }
  }
`;

// The `graphql` wrapper executes a GraphQL query and makes the results
// available on the `data` prop of the wrapped component (Hello)
export default graphql(person)(Hello);
