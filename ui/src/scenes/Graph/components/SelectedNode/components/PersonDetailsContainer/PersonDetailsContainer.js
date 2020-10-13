import React from 'react';
import PropTypes from 'prop-types';
import { gql, useQuery } from '@apollo/client';
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

const PersonDetailsContainer = ({ nodeId }) => {
  const { loading, error, data } = useQuery(GET_PERSON, { variables: { nodeId } });

  if (loading) return <WrappedLoader />;
  if (error) return `Error! ${error.message}`;
  const { person: { name, email } } = data;
  return (
    <PersonDetails
      name={name}
      email={email}
    />
  );
};

PersonDetailsContainer.propTypes = {
  nodeId: PropTypes.string.isRequired,
};

export default PersonDetailsContainer;
