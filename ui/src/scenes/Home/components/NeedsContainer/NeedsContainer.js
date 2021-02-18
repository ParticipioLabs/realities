import React from 'react';
import { useQuery } from '@apollo/client';
import _ from 'lodash';
import { useParams, Redirect } from 'react-router-dom';
import { GET_NEEDS, CACHE_QUERY } from 'services/queries';
import {
  REALITIES_CREATE_SUBSCRIPTION,
  REALITIES_DELETE_SUBSCRIPTION,
  REALITIES_UPDATE_SUBSCRIPTION,
} from 'services/subscriptions';
import useAuth from 'services/useAuth';
import ListHeader from 'components/ListHeader';
import WrappedLoader from 'components/WrappedLoader';
import CreateNeed from './components/CreateNeed';
import NeedsList from './components/NeedsList';

const NeedsContainer = () => {
  const auth = useAuth();
  const { data: localData = {} } = useQuery(CACHE_QUERY);
  const {
    subscribeToMore,
    loading,
    error,
    data,
  } = useQuery(GET_NEEDS);
  const { needId, orgSlug } = useParams();

  return (
    <div
      data-cy="needs-container"
    >
      {auth.isLoggedIn && <ListHeader />}
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
              const unsubscribes = [
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
                }),
                subscribeToMore({
                  document: REALITIES_DELETE_SUBSCRIPTION,
                  updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) return prev;
                    const { realityDeleted } = subscriptionData.data;
                    return {
                      needs: prev.needs.filter(((item) => item.nodeId !== realityDeleted.nodeId)),
                    };
                  },
                }),
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
                }),
              ];
              return () => unsubscribes.forEach((fn) => fn());
            }}
          />
        );
      })()}
    </div>
  );
};

export default NeedsContainer;
