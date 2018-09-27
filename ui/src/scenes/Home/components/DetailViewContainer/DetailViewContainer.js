import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';
import DetailView from './components/DetailView';

const GET_NEED = gql`
  query DetailViewContainer_need($nodeId: ID!) {
    need(nodeId: $nodeId) {
      nodeId
      title
      description
      deliberationLink
      guide {
        nodeId
        email
        name
      }
      realizer {
        nodeId
        email
        name
      }
    }
  }
`;

const GET_RESPONSIBILITY = gql`
  query DetailViewContainer_Responsibility($nodeId: ID!) {
    responsibility(nodeId: $nodeId) {
      nodeId
      title
      description
      deliberationLink
      guide {
        nodeId
        email
        name
      }
      realizer {
        nodeId
        email
        name
      }
    }
  }
`;

const DetailViewContainer = withRouter(({ match }) => {
  if (!match.params.needId && !match.params.responsibilityId) return null;

  const queryProps = !match.params.responsibilityId ? {
    query: GET_NEED,
    variables: {
      nodeId: match.params.needId,
    },
  } : {
    query: GET_RESPONSIBILITY,
    variables: {
      nodeId: match.params.responsibilityId,
    },
  };

  return (
    <Query {...queryProps}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;
        const node = !match.params.responsibilityId ? data.need : data.responsibility;
        return <DetailView node={node} />;
      }}
    </Query>
  );
});

DetailViewContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      needId: PropTypes.string,
      resposibilityId: PropTypes.string,
    }),
  }),
};

DetailViewContainer.defaultProps = {
  match: {
    params: {
      needId: undefined,
      responsibilityId: undefined,
    },
  },
};

export default DetailViewContainer;
