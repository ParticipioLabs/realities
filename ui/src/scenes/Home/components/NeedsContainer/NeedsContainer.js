import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';
import withAuth from '@/components/withAuth';
import ListHeader from '@/components/ListHeader';
import colors from '@/styles/colors';
import NeedsList from './components/NeedsList';

const GET_NEEDS = gql`
  query NeedsContainer_needs {
    needs {
      nodeId
      title
    }
  }
`;

const NeedsContainer = withAuth(withRouter(({ auth, match }) => (
  <div>
    <ListHeader
      text="Needs"
      color={colors.need}
      showButton={auth.isLoggedIn}
      onButtonClick={() => console.log('show new need form')}
    />
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
