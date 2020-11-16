import React from 'react';
import { gql, useQuery } from '@apollo/client';
import _ from 'lodash';
import { useParams, Redirect } from 'react-router-dom';
import { GET_NEEDS, SET_CACHE } from 'services/queries';
import {
  REALITIES_CREATE_SUBSCRIPTION,
  REALITIES_DELETE_SUBSCRIPTION,
  REALITIES_UPDATE_SUBSCRIPTION,
} from 'services/subscriptions';
import useAuth from 'services/useAuth';
import ListHeader from 'components/ListHeader';
import colors from 'styles/colors';
import WrappedLoader from 'components/WrappedLoader';
import CreateNeed from './components/CreateNeed';
import NeedsList from './components/NeedsList';

const GET_SHOW_CREATE_NEED = gql`
  query NeedsContainer_showCreateNeed {
    showCreateNeed @client
  }
`;

const NeedsContainer = () => {
  const auth = useAuth();
  const { data: localData = {}, client } = useQuery(GET_SHOW_CREATE_NEED);
  const {
    subscribeToMore,
    loading,
    error,
    data,
  } = useQuery(GET_NEEDS);
  const { needId, orgSlug } = useParams();

  return (
    <div>
      <ListHeader
        text="Needs"
        color={colors.need}
        showButton={auth.isLoggedIn}
        onButtonClick={() => client.writeQuery({
          query: SET_CACHE,
          data: {
            showCreateNeed: !localData.showCreateNeed,
            showCreateResponsibility: false,
          },
        })}
      />
      {localData.showCreateNeed && <CreateNeed />}
      {(() => {
        if (loading) return <WrappedLoader />;
        if (error) return `Error! ${error.message}`;

        const firstNeedId = data.needs && data.needs[0] && data.needs[0].nodeId;
        if (!_.find(data.needs, { nodeId: needId }) && firstNeedId) {
          return <Redirect to={`/${orgSlug}/${firstNeedId}`} />;
        }

        return (
          <NeedsList
            needs={data.needs}
            selectedNeedId={needId}
            subscribeToNeedsEvents={() => {
              subscribeToMore({
                document: REALITIES_CREATE_SUBSCRIPTION,
                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) return prev;
                  const { realityCreated } = subscriptionData.data;

                  if (realityCreated.__typename !== 'Need') return prev;

                  const alreadyExists = prev.needs
                    .filter((need) => need.nodeId === realityCreated.nodeId)
                    .length > 0;

                  if (alreadyExists) return prev;
                  return { needs: [realityCreated, ...prev.needs] };
                },
              });
              subscribeToMore({
                document: REALITIES_DELETE_SUBSCRIPTION,
                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) return prev;
                  const { realityDeleted } = subscriptionData.data;
                  return {
                    needs: prev.needs.filter(((item) => item.nodeId !== realityDeleted.nodeId)),
                  };
                },
              });
              subscribeToMore({
                document: REALITIES_UPDATE_SUBSCRIPTION,
                updateQuery: (prev, { subscriptionData }) => {
                  if (!subscriptionData.data) return prev;

                  const { realityUpdated } = subscriptionData.data;

                  return {
                    needs: prev.needs.map((item) => {
                      if (item.nodeId === realityUpdated.nodeId) return realityUpdated;
                      return item;
                    }),
                  };
                },
              });
            }}
          />
        );
      })()}
    </div>
  );
};

export default NeedsContainer;
