// Queries that need to be accessible to several components (for reusability, cache updates, etc.)

import gql from 'graphql-tag';

export const GET_NEEDS = gql`
  query Needs {
    needs {
      nodeId
      title
    }
  }
`;

export const GET_NEED_RESPONSIBILITIES = gql`
  query NeedResponsibilities($needId: ID!) {
    need(nodeId: $needId) {
      nodeId
      fulfilledBy {
        nodeId
        title
      }
    }
  }
`;
