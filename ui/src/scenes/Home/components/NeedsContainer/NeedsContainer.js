import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import { Collapse } from 'reactstrap';
import { Query } from 'react-apollo';
import withAuth from '@/components/withAuth';
import ListHeader from '@/components/ListHeader';
import colors from '@/styles/colors';
import CreateNeed from './components/CreateNeed';
import NeedsList from './components/NeedsList';

const GET_CREATE_NEED_STATE = gql`
  query NeedsContainer_showCreateNeed {
    showCreateNeed @client
  }
`;

const GET_NEEDS = gql`
  query NeedsContainer_needs {
    needs {
      nodeId
      title
    }
  }
`;

const NeedsContainer = withAuth(withRouter(({ auth, match }) => (
  <Query query={GET_CREATE_NEED_STATE}>
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
            if (loading) return 'Loading...';
            if (error) return `Error! ${error.message}`;

            return (
              <NeedsList needs={data.needs} selectedNeedId={match.params.needId} />
            );
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
