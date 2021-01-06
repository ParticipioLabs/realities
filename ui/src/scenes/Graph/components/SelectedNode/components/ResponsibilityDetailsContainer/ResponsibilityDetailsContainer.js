import React from 'react';
import PropTypes from 'prop-types';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import WrappedLoader from 'components/WrappedLoader';
import ResponsibilityDetails from './components/ResponsibilityDetails';

const GET_RESPONSIBILITY = gql`
  query ResponsibilityDetailsContainer_responsibility($nodeId: ID!) {
    responsibility(nodeId: $nodeId) {
      nodeId
      title
      description
      fulfills {
        nodeId
      }
    }
  }
`;

const ResponsibilityDetailsContainer = ({ nodeId }) => {
  const { orgSlug } = useParams();
  const { loading, error, data } = useQuery(GET_RESPONSIBILITY, {
    variables: { nodeId },
  });

  if (loading) return <WrappedLoader />;
  if (error) return `Error! ${error.message}`;
  const {
    responsibility: {
      title,
      description,
      fulfills,
    },
  } = data;
  return (
    <ResponsibilityDetails
      title={title}
      description={description}
      path={`/${orgSlug}/reality/${fulfills.nodeId}/${nodeId}`}
    />
  );
};

ResponsibilityDetailsContainer.propTypes = {
  nodeId: PropTypes.string.isRequired,
};

export default ResponsibilityDetailsContainer;
