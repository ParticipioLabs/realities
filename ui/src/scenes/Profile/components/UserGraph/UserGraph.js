import React from 'react';
import withAuth from '@/components/withAuth';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import LocalGraph from './components/LocalGraph';

const CardSection = styled.div`
  margin-bottom: 1rem;
`;
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
        <CardSection>
          <div>User Graph</div>
          <LocalGraph nodeType={props.__typename} nodeId={props.nodeId} />
        </CardSection>
      );
    }}
  </Query>
));

export default withAuth(UserGraph);
