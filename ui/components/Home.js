import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

function Home({ data }) {
  // console.log(data);
  return (
    <div>
      <SearchField />
      <SearchResultList />
    </div>
  );
}

Home.propTypes = {
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
// available on the `data` prop of the wrapped component (Home)
export default graphql(person)(Home);
