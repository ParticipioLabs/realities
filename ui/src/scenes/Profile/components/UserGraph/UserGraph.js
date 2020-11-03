import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { gql, useQuery } from '@apollo/client';
import LocalGraph from 'components/LocalGraph';
import WrappedLoader from 'components/WrappedLoader';

const CardSection = styled.div`
  margin-bottom: 1rem;
`;

const GET_PROFILE_ID_AND_TYPE = gql`
  query($email: String!) {
    person(email: $email) {
      nodeId
    }
  }
`;

const UserGraph = ({ email }) => {
  const {
    loading,
    error,
    data,
  } = useQuery(GET_PROFILE_ID_AND_TYPE, { variables: { email } });

  if (loading) return <WrappedLoader />;
  if (error) return `Error! ${error.message}`;
  const node = data.person;
  return (
    <CardSection>
      <div>User Graph</div>
      <LocalGraph
        nodeId={node.nodeId}
        nodeType={node.__typename}
        email={email}
      />
    </CardSection>
  );
};

UserGraph.propTypes = {
  email: PropTypes.string,
};

UserGraph.defaultProps = {
  email: '',
};

export default UserGraph;
