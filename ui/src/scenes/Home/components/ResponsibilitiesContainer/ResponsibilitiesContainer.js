import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { Collapse } from 'reactstrap';
import { Query } from 'react-apollo';
import { GET_NEED_RESPONSIBILITIES } from '@/services/queries';
import { REALITIES_DELETE_SUBSCRIPTION, REALITIES_UPDATE_SUBSCRIPTION } from '@/services/subscriptions';
import withAuth from '@/components/withAuth';
import ListHeader from '@/components/ListHeader';
import colors from '@/styles/colors';
import WrappedLoader from '@/components/WrappedLoader';
import CreateResponsibility from './components/CreateResponsibility';
import ResponsibilitiesList from './components/ResponsibilitiesList';

const GET_SHOW_CREATE_RESPONSIBILITY = gql`
  query ResponsibilitiesContainer_showCreateResponsibility {
    showCreateResponsibility @client
  }
`;

const RESPONSIBILITES_CREATE_SUBSCRIPTION = gql`
  subscription ResponsibilitiesContainer_responsibilityCreated {
    responsibilityCreated {
      title
      nodeId
      fulfills {
        nodeId
      }
    }
  }
`;

const ResponsibilitiesContainer = withAuth(withRouter(({ auth, match }) => {
  if (!match.params.needId) return null;

  return (
    <Query query={GET_SHOW_CREATE_RESPONSIBILITY}>
      {({ data: localData, client }) => (
        <div>
          <ListHeader
            text="Responsibilities"
            color={colors.responsibility}
            showButton={auth.isLoggedIn && !!match.params.needId}
            onButtonClick={() => client.writeData({
              data: {
                showCreateResponsibility: !localData.showCreateResponsibility,
                showCreateNeed: false,
              },
            })}
          />
          <Collapse isOpen={localData.showCreateResponsibility}>
            <CreateResponsibility />
          </Collapse>
          <Query query={GET_NEED_RESPONSIBILITIES} variables={{ needId: match.params.needId }}>
            {({
              subscribeToMore,
              loading,
              error,
              data,
            }) => {
              if (loading) return <WrappedLoader />;
              if (error) return `Error! ${error.message}`;
              if (!data.need) return null;
              return (
                <ResponsibilitiesList
                  responsibilities={data.need.fulfilledBy}
                  selectedResponsibilityId={match.params.responsibilityId}
                  subscribeToResponsibilitiesEvents={() => {
                    subscribeToMore({
                      document: RESPONSIBILITES_CREATE_SUBSCRIPTION,
                      updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data) return prev;

                        const { responsibilityCreated } = subscriptionData.data;

                        // if the new responsibility is not on the current need, do nothing
                        if (responsibilityCreated.fulfills.nodeId !== prev.need.nodeId) return prev;

                        // item will already exist in cache if it was added by the current client
                        const alreadyExists = prev.need.fulfilledBy
                          .filter(resp => resp.nodeId === responsibilityCreated.nodeId).length > 0;

                        if (alreadyExists) {
                          return prev;
                        }
                        return {
                            need: {
                              ...prev.need,
                              fulfilledBy: [responsibilityCreated, ...prev.need.fulfilledBy],
                            },
                        };
                      },
                    });
                    subscribeToMore({
                      document: REALITIES_DELETE_SUBSCRIPTION,
                      updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data) return prev;
                        const result = Object.assign({}, prev);

                        result.need.fulfilledBy = _.filter(prev.need.fulfilledBy, (item =>
                              item.nodeId !== subscriptionData.data.realityDeleted));

                        console.log('Responsibility Removed!', subscriptionData.data.realityDeleted.nodeId, prev, result);

                        return result;
                      },
                    });
                    subscribeToMore({
                      document: REALITIES_UPDATE_SUBSCRIPTION,
                      updateQuery: (prev, { subscriptionData }) => {
                        if (!subscriptionData.data) return prev;
                        console.log('Need Change!', prev);
                        return prev;
                      },
                    });
                  }}
                />
              );
            }}
          </Query>
        </div>
      )}
    </Query>
  );
}));

ResponsibilitiesContainer.propTypes = {
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

ResponsibilitiesContainer.defaultProps = {
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

export default ResponsibilitiesContainer;
