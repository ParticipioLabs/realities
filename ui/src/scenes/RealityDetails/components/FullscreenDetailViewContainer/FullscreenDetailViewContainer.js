import React from 'react';
import PropTypes from 'prop-types';
import { gql, useQuery } from '@apollo/client';
import { withRouter } from 'react-router-dom';
import withAuth from '@/components/withAuth';
import WrappedLoader from '@/components/WrappedLoader';
import { SET_CACHE } from '@/services/queries';
import FullscreenDetailView from './components/FullscreenDetailView';

const createDetailViewQuery = nodeType => gql`
  query FullscreenDetailViewContainer_${nodeType}($nodeId: ID!) {
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
      deliberations {
        nodeId
        title
        url
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
      needsThatDependOnThis {
        nodeId
        title
      }
      responsibilitiesThatDependOnThis {
        nodeId
        title
        fulfills {
          nodeId
        }
      }
      ${nodeType === 'responsibility' ? `fulfills {
        nodeId
        title
      }` : ''}
    }
    showDetailedEditView @client
  }
`;


const GET_NEED = createDetailViewQuery('need');
const GET_RESPONSIBILITY = createDetailViewQuery('responsibility');

const FullscreenDetailViewContainer = withAuth(withRouter(({
  auth,
  history,
  match,
}) => {
  if (!match.params.needId && !match.params.responsibilityId) return null;

  const isNeed = !match.params.responsibilityId;

  const queryProps = isNeed ? {
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

  const {
    loading, error, data, client,
  } = useQuery(queryProps.query, queryProps);

  if (loading) return <WrappedLoader />;
  if (error) return `Error! ${error.message}`;
  const node = isNeed ? data.need : data.responsibility;
  if (!node) return null;
  return (
    <FullscreenDetailView
      node={node}
      showEdit={data.showDetailedEditView}
      isLoggedIn={auth.isLoggedIn}
      onClickEdit={() => client.writeQuery({
        query: SET_CACHE,
        data: {
          showDetailedEditView: true,
        },
      })}
      onClickCancel={() => client.writeQuery({
        query: SET_CACHE,
        data: {
          showDetailedEditView: false,
        },
      })}
      onClickNavigate={() => history.push(`/${match.params.needId}/${match.params.responsibilityId || ''}`)}
    />
  );
}));

FullscreenDetailViewContainer.propTypes = {
  auth: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      needId: PropTypes.string,
      resposibilityId: PropTypes.string,
    }),
  }),
};

FullscreenDetailViewContainer.defaultProps = {
  auth: {
    isLoggedIn: false,
  },
  match: {
    params: {
      needId: undefined,
      responsibilityId: undefined,
    },
  },
};

export default FullscreenDetailViewContainer;
