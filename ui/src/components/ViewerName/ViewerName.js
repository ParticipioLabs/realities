import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import withAuth from '@/components/withAuth';

const GET_VIEWER_NAME = gql`
  query UpdateViewerName_person($email: String!) {
    person(email: $email) {
      nodeId
      name
    }
  }
`;

const ViewerName = withAuth(({ auth }) => (
  <Query
    query={GET_VIEWER_NAME}
    variables={{ email: auth.email }}
  >
    {({ loading, error, data }) => {
      if (loading) return auth.email;
      if (error) return `Error! ${error.message}`;
      const viewer = data.person || {};
      return viewer.name || auth.email;
    }}
  </Query>
));

ViewerName.propTypes = {
  auth: PropTypes.shape({
    email: PropTypes.string,
  }),
};

ViewerName.defaultProps = {
  auth: {
    email: '',
  },
};

export default ViewerName;
