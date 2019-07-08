import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import WrappedLoader from '@/components/WrappedLoader';
import PersonDetails from './components/PersonDetails';

const GET_PERSON = gql`
  query PersonDetailsContainer_person($nodeId: ID!) {
    person(nodeId: $nodeId) {
      nodeId
      name
      email
    }
  }
`;

const PersonDetailsContainer = ({ nodeId }) => (
  <Query
    query={GET_PERSON}
    variables={{ nodeId }}
  >
    {({ loading, error, data }) => {
      if (loading) return <WrappedLoader />;
      if (error) return `Error! ${error.message}`;
      const { person: { name, email } } = data;
      return (
        <PersonDetails
          name={name}
          email={email}
        />
      );
    }}
  </Query>
);

PersonDetailsContainer.propTypes = {
  nodeId: PropTypes.string.isRequired,
};

export default PersonDetailsContainer;
