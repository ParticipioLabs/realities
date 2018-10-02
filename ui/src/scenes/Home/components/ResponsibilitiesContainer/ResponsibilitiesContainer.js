import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';
import withAuth from '@/components/withAuth';
import ListHeader from '@/components/ListHeader';
import colors from '@/styles/colors';
import ResponsibilitiesList from './components/ResponsibilitiesList';

const GET_RESPONSIBILITIES = gql`
  query ResponsibilitiesContainer_need($needId: ID!) {
    need(nodeId: $needId) {
      nodeId
      fulfilledBy {
        nodeId
        title
      }
    }
  }
`;

const ResponsibilitiesContainer = withAuth(withRouter(({ auth, match }) => {
  if (!match.params.needId) return null;

  return (
    <div>
      <ListHeader
        text="Responsibilities"
        color={colors.responsibility}
        showButton={auth.isLoggedIn && !!match.params.needId}
        onButtonClick={() => console.log('show new resp form')}
      />
      <Query query={GET_RESPONSIBILITIES} variables={{ needId: match.params.needId }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;

          return (
            <ResponsibilitiesList
              responsibilities={data.need.fulfilledBy}
              selectedResponsibilityId={match.params.responsibilityId}
            />
          );
        }}
      </Query>
    </div>
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
