import React from 'react';
import { string } from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const GET_USER_DETAILS = gql`
  query ($email: String!) {
    person(email: $email) {
      nodeId
      name
      guidesNeeds {
        title
      }
      realizesNeeds {
        title
      }
      guidesResponsibilities {
        title
      }
      realizesResponsibilities {
        title
      }
    }
  }
`;

const UserGraph = ({ email }) => (
  <Query query={GET_USER_DETAILS} variables={{ email }}>
    {({ data }) => (
      <div>User Graph</div>
    )}
  </Query>
);

UserGraph.propTypes = {
  email: string,
};

UserGraph.defaultProps = {
  email: '',
};

export default UserGraph;
