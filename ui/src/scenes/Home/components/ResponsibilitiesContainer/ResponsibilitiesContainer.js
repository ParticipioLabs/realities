import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';
import ResponsibilitiesList from './components/ResponsibilitiesList';

const GET_RESPONSIBILITIES = gql`
  query Responsibilities($needId: ID!) {
    need(nodeId: $needId) {
      nodeId
      fulfilledBy {
        nodeId
        title
      }
    }
  }
`;

const ResponsibilitiesContainer = withRouter(({ match }) => (
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
));

ResponsibilitiesContainer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      needId: PropTypes.string,
      resposibilityId: PropTypes.string,
    }),
  }),
};

ResponsibilitiesContainer.defaultProps = {
  match: {
    params: {
      needId: undefined,
      responsibilityId: undefined,
    },
  },
};

export default ResponsibilitiesContainer;
