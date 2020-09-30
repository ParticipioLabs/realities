// Subscriptions that need to be accessible to several components

import { gql } from '@apollo/client';

export const REALITIES_CREATE_SUBSCRIPTION = gql`
  subscription realityCreated {
    realityCreated {
      title
      nodeId
      realizer {
        nodeId
        name
      }
      ... on Need {
        fulfilledBy {
          nodeId
          title
          realizer {
            nodeId
            name
          }
        }
      }
      ... on Responsibility {
        fulfills {
          nodeId
        }
      }
    }
  }
`;

export const REALITIES_DELETE_SUBSCRIPTION = gql`
  subscription realityDeleted {
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
  subscription realityUpdated {
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
      needsThatDependOnThis {
        nodeId
        title
      }
      responsibilitiesThatDependOnThis {
        nodeId
        title
        fulfills {
          nodeId
        }
      }
      deliberations {
        nodeId
        url
        title
      }
      ... on Need {
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
  }
`;
