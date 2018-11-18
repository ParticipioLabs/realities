import React from 'react';
import { string } from 'prop-types';
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
      <CardSection>
        <div>User Graph</div>
        <LocalGraph nodeType={data.__typename} nodeId={data.nodeId} />
      </CardSection>
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
