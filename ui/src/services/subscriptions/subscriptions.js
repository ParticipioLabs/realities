// Subscriptions that need to be accessible to several components

import gql from 'graphql-tag';

export const REALITIES_CREATE_SUBSCRIPTION = gql`
  subscription ResponsibilitiesContainer_realityCreated {
    realityCreated {
      title
      nodeId
      ... on Responsibility {
        fulfills {
          nodeId
        }
      }
    }
  }
`;

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
      description
      deliberationLink
      guide {
        nodeId
        email
        name
      }
      realizer {
        nodeId
        email
        name
      }
      dependsOnNeeds {
        nodeId
        title
      }
      dependsOnResponsibilities {
        nodeId
        title
        fulfills {
          nodeId
        }
      }
    }
  }
`;
