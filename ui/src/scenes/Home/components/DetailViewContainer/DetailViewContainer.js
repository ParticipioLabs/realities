import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { withRouter } from 'react-router-dom';
import { Query } from '@apollo/client/react/components';
import withAuth from '@/components/withAuth';
import WrappedLoader from '@/components/WrappedLoader';
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

const DetailViewContainer = withAuth(withRouter(({ auth, match }) => {
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
      {({
        loading,
        error,
        data = {},
        client,
      }) => {
        if (loading) return <WrappedLoader />;
        if (error) return `Error! ${error.message}`;
        const node = !match.params.responsibilityId ? data.need : data.responsibility;
        if (!node) return null;
        return (
          <DetailView
            node={node}
            showEdit={data.showDetailedEditView}
            isLoggedIn={auth.isLoggedIn}
            onClickEdit={() => client.writeData({ data: { showDetailedEditView: true } })}
            onClickCancel={() => client.writeData({ data: { showDetailedEditView: false } })}
          />
        );
      }}
    </Query>
  );
}));

DetailViewContainer.propTypes = {
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

DetailViewContainer.defaultProps = {
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

export default DetailViewContainer;
