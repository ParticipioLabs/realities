import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
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

const NeedsContainer = withAuth(withRouter(({ auth, match, history }) => (
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
          {({ loading, error, data }) => {
            if (loading) return <WrappedLoader />;
            if (error) return `Error! ${error.message}`;
            const firstNeedId = data.needs && data.needs[0] && data.needs[0].nodeId;
            if (!match.params.needId && firstNeedId) history.push(`/${firstNeedId}`);
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
  history: PropTypes.shape({
    push: PropTypes.func,
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
  history: {
    push: () => null,
  },
};

export default NeedsContainer;
