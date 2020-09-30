import { gql } from '@apollo/client';

// eslint-disable-next-line import/prefer-default-export
export const SET_CACHE = gql`
  query ShowCreates {
    showCreateNeed
    showCreateResponsibility
    showDetailedEditView
  }
`;
