import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from '@apollo/client/react/components';
import WrappedLoader from '@/components/WrappedLoader';
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

const ResponsibilityDetailsContainer = ({ nodeId }) => (
  <Query
    query={GET_RESPONSIBILITY}
    variables={{ nodeId }}
  >
    {({ loading, error, data }) => {
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
          path={`/reality/${fulfills.nodeId}/${nodeId}`}
        />
      );
    }}
  </Query>
);

ResponsibilityDetailsContainer.propTypes = {
  nodeId: PropTypes.string.isRequired,
};

export default ResponsibilityDetailsContainer;
