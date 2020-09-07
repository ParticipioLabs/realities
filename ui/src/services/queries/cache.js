import { gql } from '@apollo/client';

export const SHOW_CREATES = gql`
  query ShowCreates {
    showCreateNeed
    showCreateResponsibility
  }
`;

export const potato = 'asdf';
