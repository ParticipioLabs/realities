import React from 'react';
import PropTypes from 'prop-types';
import { gql, useQuery } from '@apollo/client';
import { useHistory, useParams } from 'react-router-dom';
import useAuth from 'services/useAuth';
import WrappedLoader from 'components/WrappedLoader';
import { SET_CACHE } from 'services/queries';
import DetailView from './components/DetailView';

const createDetailViewQuery = (nodeType) => {
  const isResp = nodeType === 'responsibility';
  return gql`
  query DetailViewContainer_${nodeType}($nodeId: ID!) {
    ${nodeType}(nodeId: $nodeId) {
      nodeId
      title
      description
      guide {
        nodeId
        email
        name
      }
      ${isResp ? `realizer {
          nodeId
          email
          name
        }
        deliberations {
          nodeId
          title
          url
        }
        dependsOnResponsibilities {
          nodeId
          title
          fulfills {
            nodeId
          }
        }
        responsibilitiesThatDependOnThis {
          nodeId
          title
          fulfills {
            nodeId
          }
        }
      ` : ''}
      ${isResp ? 'fulfills' : 'fulfilledBy'} {
        nodeId
        title
      }
    }
    showDetailedEditView @client
  }
`;
};

const GET_NEED = createDetailViewQuery('need');
const GET_RESPONSIBILITY = createDetailViewQuery('responsibility');

const DetailViewContainer = ({ fullscreen }) => {
  const auth = useAuth();
  const history = useHistory();
  const params = useParams();

  const skip = !params.needId && !params.responsibilityId;
  const queryProps = !params.responsibilityId ? {
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
    loading,
    error,
    data = {},
    client,
  } = useQuery(queryProps.query, queryProps);

  if (skip) return null;
  if (loading) return <WrappedLoader />;
  if (error) return `Error! ${error.message}`;

  const fullscreenToggleUrl = fullscreen
    ? `/${params.orgSlug}/${params.needId}/${params.responsibilityId || ''}`
    : `/${params.orgSlug}/reality/${params.needId}/${params.responsibilityId || ''}`;
  const onClickFullscreen = () => history.push(fullscreenToggleUrl);

  const node = !params.responsibilityId ? data.need : data.responsibility;
  if (!node) return null;
  return (
    <DetailView
      node={node}
      fullscreen={fullscreen}
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
      onClickFullscreen={onClickFullscreen}
    />
  );
};

DetailViewContainer.propTypes = {
  fullscreen: PropTypes.bool,
};

DetailViewContainer.defaultProps = {
  fullscreen: false,
};

export default DetailViewContainer;
