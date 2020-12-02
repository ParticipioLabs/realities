import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';
import useAuth from 'services/useAuth';
import WrappedLoader from 'components/WrappedLoader';
import { SET_CACHE } from 'services/queries';
import FullscreenDetailView from './components/FullscreenDetailView';

const createDetailViewQuery = (nodeType) => gql`
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

const FullscreenDetailViewContainer = () => {
  const auth = useAuth();
  const history = useHistory();
  const params = useParams();

  const isNeed = !params.responsibilityId;
  const skip = !params.needId && !params.responsibilityId;

  const queryProps = isNeed ? {
    query: GET_NEED,
    variables: {
      nodeId: params.needId,
    },
    skip,
  } : {
    query: GET_RESPONSIBILITY,
    variables: {
      nodeId: params.responsibilityId,
    },
    skip,
  };

  const {
    loading, error, data, client,
  } = useQuery(queryProps.query, queryProps);

  if (skip) return null;
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
      onClickNavigate={() => history.push(`/${params.orgSlug}/${params.needId}/${params.responsibilityId || ''}`)}
    />
  );
};

export default FullscreenDetailViewContainer;
