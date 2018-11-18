import React from 'react';
import withAuth from '@/components/withAuth';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const GET_USER_DETAILS = gql`
  query ($email: String!) {
    person(email: $email) {
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

const UserGraph = withAuth(({ auth }) => (
  <Query query={GET_USER_DETAILS} variables={{ email: auth.email }}>
    {(props) => {
      console.log(props);
      return (
        <div>User Graph</div>
      );
    }}
  </Query>
));

export default withAuth(UserGraph);
