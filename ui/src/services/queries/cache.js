import { gql } from '@apollo/client';

// eslint-disable-next-line import/prefer-default-export
export const CACHE_QUERY = gql`
  query ShowCreates {
    showCreateNeed @client
    showCreateResponsibility @client
    showDetailedEditView @client
  }
`;
