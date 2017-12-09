import React from 'react';
// import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
// import SearchField from '../components/SearchField';
import SearchResultList from './SearchResultList';

const results = [{
  id: 'need1',
  title: 'Fire Safety',
  dependsOn: ['need2'],
}, {
  id: 'need2',
  title: 'Safe Burn Environment',
  dependsOn: [],
}, {
  id: 'need3',
  title: 'Water',
  dependsOn: [],
}];

function Home() {
  // console.log(data);
  return (
    <div>
      <SearchResultList searchResults={results} />
    </div>
  );
}


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
