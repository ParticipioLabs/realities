import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import _ from 'lodash';
import { withRouter, Redirect } from 'react-router-dom';
import { Query } from 'react-apollo';
import withAuth from '@/components/withAuth';
import ListHeader from '@/components/ListHeader';
import colors from '@/styles/colors';
import WrappedLoader from '@/components/WrappedLoader';
import CreateNeed from './components/CreateNeed';
import NeedsList from './components/NeedsList';

const GET_SHOW_CREATE_NEED = gql`
  query NeedsContainer_showCreateNeed {
    showCreateNeed @client
  }
`;

const GET_NEEDS = gql`
  query Needs {
    needs {
      nodeId
      title
      fulfilledBy {
        nodeId
        title
        realizer {
          nodeId
          name
        }
      }
    }
  }
`;

const NeedsContainer = withAuth(withRouter(({ auth, match }) => (
  <Query query={GET_SHOW_CREATE_NEED}>
    {({ data: localData, client }) => (
      <div>
        <ListHeader
          text="Needs"
          color={colors.need}
          showButton={auth.isLoggedIn}
          onButtonClick={() =>
              client.writeData({
                data: {
                  showCreateNeed: !localData.showCreateNeed,
                  showCreateResponsibility: false,
                },
              })
            }
        />
        {localData.showCreateNeed && <CreateNeed />}
        <Query query={GET_NEEDS}>
          {({ loading, error, data }) => {
              if (loading) return <WrappedLoader />;
              if (error) return `Error! ${error.message}`;
              const firstNeedId = data.needs && data.needs[0] && data.needs[0].nodeId;
              if (!_.find(data.needs, { nodeId: match.params.needId }) && firstNeedId) {
                return <Redirect to={`/${firstNeedId}`} />;
              }
              return <NeedsList needs={data.needs} selectedNeedId={match.params.needId} />;
            }}
        </Query>
      </div>
      )}
  </Query>
)));

NeedsContainer.propTypes = {
  auth: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      needId: PropTypes.string,
    }),
  }),
};

NeedsContainer.defaultProps = {
  auth: {
    isLoggedIn: false,
  },
  match: {
    params: {
      needId: undefined,
    },
  },
};

export default NeedsContainer;
