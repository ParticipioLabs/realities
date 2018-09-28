import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';
import DetailView from './components/DetailView';

const createDetailViewQuery = nodeType => gql`
  query DetailViewContainer_${nodeType}($nodeId: ID!) {
    ${nodeType}(nodeId: $nodeId) {
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
      dependsOnNeeds {
        nodeId
        title
      }
      dependsOnResponsibilities {
        nodeId
        title
        fulfills {
          nodeId
        }
      }
    }
  }
`;

const GET_NEED = createDetailViewQuery('need');
const GET_RESPONSIBILITY = createDetailViewQuery('responsibility');

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
