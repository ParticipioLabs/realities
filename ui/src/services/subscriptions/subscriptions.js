// Subscriptions that need to be accessible to several components

import gql from 'graphql-tag';

export const REALITIES_DELETE_SUBSCRIPTION = gql`
  subscription Realities {
    realityDeleted {
      nodeId
      title
      guide {
        email
      }
      realizer {
        email
      }
      description
      deliberationLink
    }
  }
`;

export const REALITIES_UPDATE_SUBSCRIPTION = gql`
  subscription Realities {
    realityUpdated {
      nodeId
      title
      guide {
        email
      }
      realizer {
        email
      }
      description
      deliberationLink
    }
  }
`;
