import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import _ from 'lodash';
import { withRouter, Redirect } from 'react-router-dom';
import { Collapse } from 'reactstrap';
import { Query } from 'react-apollo';
import { GET_NEEDS } from '@/services/queries';
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

const NEEDS_ADD_SUBSCRIPTION = gql`
  subscription Needs {
    needAdded {
     title
     nodeId
    }
  }
`;

const NEEDS_REMOVE_SUBSCRIPTION = gql`
  subscription Needs {
    needRemoved
  }
`;

// TODO: Not implemented yet!
const NEEDS_CHANGE_SUBSCRIPTION = gql`
  subscription Needs {
    needChanged {
      title
      nodeId
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
          onButtonClick={() => client.writeData({
            data: {
              showCreateNeed: !localData.showCreateNeed,
              showCreateResponsibility: false,
            },
          })}
        />
        <Collapse isOpen={localData.showCreateNeed}>
          <CreateNeed />
        </Collapse>
        <Query query={GET_NEEDS}>
          {({
              subscribeToMore,
              loading,
              error,
              data,
            }) => {
            if (loading) return <WrappedLoader />;
            if (error) return `Error! ${error.message}`;

            const firstNeedId = data.needs && data.needs[0] && data.needs[0].nodeId;
            if (!_.find(data.needs, { nodeId: match.params.needId }) && firstNeedId) {
              return <Redirect to={`/${firstNeedId}`} />;
            }

            return (<NeedsList
              needs={data.needs}
              selectedNeedId={match.params.needId}
              subscribeToNeedsEvents={() => {
                subscribeToMore({
                  document: NEEDS_ADD_SUBSCRIPTION,
                  updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) return prev;
                    const newNeed = subscriptionData.data.needAdded;
                    console.log('New Need Received!', newNeed, prev);
                    return { needs: [newNeed].concat(prev.needs) };
                  },
                });
                subscribeToMore({
                  document: NEEDS_REMOVE_SUBSCRIPTION,
                  updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) return prev;
                    const newNeed = subscriptionData.data.needRemoved;
                    console.log('Need Removed!', newNeed, prev);
                    return {
                      needs: _.filter(prev.needs, (item =>
                        item.nodeId !== subscriptionData.data.needRemoved)),
                    };
                  },
                });
                subscribeToMore({
                  document: NEEDS_CHANGE_SUBSCRIPTION,
                  updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) return prev;
                    console.log('Need Change!', prev);
                    return prev;
                  },
                });
              }}
            />);
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
