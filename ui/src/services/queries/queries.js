// Queries that need to be accessible to several components (for reusability, cache updates, etc.)

import { gql } from '@apollo/client';

export const GET_NEEDS = gql`
  query Needs {
    needs {
      nodeId
      title
      fulfilledBy {
        nodeId
        title
        realizer {
          nodeId
          name
        }
      }
    }
  }
`;

export const GET_RESPONSIBILITIES = gql`
  query Responsibilities($needId: ID!) {
    responsibilities(fulfillsNeedId: $needId) {
      nodeId
      title
      realizer {
        nodeId
        name
      }
    }
  }
`;

export const GET_REALITY_INFOS = gql`
  query RealityInfos($realityId: ID!) {
    reality(nodeId: $realityId) {
      nodeId
      fulfilledBy {
        nodeId
        title
        url
      }
    }
  }
`;
