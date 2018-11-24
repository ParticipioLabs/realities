import React from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';

import { GET_RESPONSIBILITIES } from '@/services/queries';
import TypeaheadInput from '@/components/TypeaheadInput';
import TypeBadge from '@/components/TypeBadge';

const CHANGE_OWNER = gql`
  mutation changeFulfills(
    $responsibilityId: ID!
    $needId: ID!
  ) {
    changeFulfills(responsibilityId: $responsibilityId, needId: $needId) {
      nodeId
      title
      fulfills {
        nodeId
      }
    }
  }
`;

const ChangeFulfills = ({ node }) => (
  <div>
    <p>Move responsibility to another Need:</p>
    <Mutation
      mutation={CHANGE_OWNER}
      update={(cache, { data: { changeFulfills } }) => {
        const { responsibilities } = cache.readQuery({
          query: GET_RESPONSIBILITIES,
          variables: { needId: node.fulfills.nodeId },
        });

        cache.writeQuery({
          query: GET_RESPONSIBILITIES,
          variables: {
            needId: node.fulfills.nodeId,
          },
          data: {
            responsibilities: responsibilities
            .filter(i => i.nodeId !== changeFulfills.nodeId),
          },
        });
      }}
    >
      {changeOwner => (
        <TypeaheadInput
          placeholder="Search needs"
          searchQuery={gql`
            query ChangeOwner_searchNeeds($term: String!) {
              needs(search: $term) {
                nodeId
                title
              }
            }
          `}
          selectedItem={node.fulfills}
          queryDataToResultsArray={data => [
            ...(data.needs || []),
          ]}
          itemToString={i => (i && i.title) || ''}
          itemToResult={i => (
            <span>
              <TypeBadge nodeType={i.__typename} />
              {i.title}
            </span>
          )}
          onChange={(selectedNode) => {
            if (selectedNode) {
              changeOwner({
                variables: {
                  responsibilityId: node.nodeId,
                  needId: selectedNode.nodeId,
                },
              });
            }
            }}
        />
        )
      }
    </Mutation>
  </div>
);

ChangeFulfills.propTypes = {
  node: PropTypes.shape({
    __typename: PropTypes.string,
    nodeId: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    deliberations: PropTypes.arrayOf(PropTypes.shape({
      __typename: PropTypes.string,
      nodeId: PropTypes.string,
      title: PropTypes.string,
    })),
    guide: PropTypes.shape({
      nodeId: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
    }),
    realizer: PropTypes.shape({
      nodeId: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
    }),
    dependsOnNeeds: PropTypes.arrayOf(PropTypes.shape({
      __typename: PropTypes.string,
      nodeId: PropTypes.string,
      title: PropTypes.string,
    })),
    dependsOnResponsibilities: PropTypes.arrayOf(PropTypes.shape({
      __typename: PropTypes.string,
      nodeId: PropTypes.string,
      title: PropTypes.string,
      fulfills: PropTypes.shape({
        nodeId: PropTypes.string,
      }),
    })),
  }),
};

ChangeFulfills.defaultProps = {
  node: {
    nodeId: '',
    title: '',
    description: '',
    deliberations: [],
    guide: {
      nodeId: '',
      email: '',
      name: '',
    },
    realizer: {
      nodeId: '',
      email: '',
      name: '',
    },
    dependsOnNeeds: [],
    dependsOnResponsibilities: [],
  },
};

export default ChangeFulfills;
