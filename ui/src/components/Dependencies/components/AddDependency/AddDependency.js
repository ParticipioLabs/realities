import React from 'react';
import PropTypes from 'prop-types';
import { gql, useMutation } from '@apollo/client';
import { FormGroup, Label } from 'reactstrap';
import TypeaheadInput from '@/components/TypeaheadInput';
import TypeBadge from '@/components/TypeBadge';

const ADD_NEED_DEPENDS_ON_NEEDS = gql`
  mutation AddDependency_addNeedDependsOnNeedsMutation(
    $from: _NeedInput!
    $to: _NeedInput!
  ) {
    addNeedDependsOnNeeds(from: $from, to: $to) {
      from {
        nodeId
        dependsOnNeeds {
          nodeId
          title
        }
      }
    }
  }
`;

const ADD_NEED_DEPENDS_ON_RESPONSIBILITIES = gql`
  mutation AddDependency_addNeedDependsOnResponsibilitiesMutation(
    $from: _NeedInput!
    $to: _ResponsibilityInput!
  ) {
    addNeedDependsOnResponsibilities(from: $from, to: $to) {
      from {
        nodeId
        dependsOnResponsibilities {
          nodeId
          title
          fulfills {
            nodeId
          }
        }
      }
    }
  }
`;

const ADD_RESPONSIBILITY_DEPENDS_ON_NEEDS = gql`
  mutation AddDependency_addResponsibilityDependsOnNeedsMutation(
    $from: _ResponsibilityInput!
    $to: _NeedInput!
  ) {
    addResponsibilityDependsOnNeeds(from: $from, to: $to) {
      from {
        nodeId
        dependsOnNeeds {
          nodeId
          title
        }
      }
    }
  }
`;

const ADD_RESPONSIBILITY_DEPENDS_ON_RESPONSIBILITIES = gql`
  mutation AddDependency_addResponsibilityDependsOnResponsibilitiesMutation(
    $from: _ResponsibilityInput!
    $to: _ResponsibilityInput!
  ) {
    addResponsibilityDependsOnResponsibilities(from: $from, to: $to) {
      from {
        nodeId
        dependsOnResponsibilities {
          nodeId
          title
          fulfills {
            nodeId
          }
        }
      }
    }
  }
`;

const AddDependency = ({ nodeType, nodeId }) => {
  const ADD_NEED_DEPENDENCY = nodeType === 'Need'
    ? ADD_NEED_DEPENDS_ON_NEEDS
    : ADD_RESPONSIBILITY_DEPENDS_ON_NEEDS;
  const ADD_RESPONSIBILITY_DEPENDENCY = nodeType === 'Need'
    ? ADD_NEED_DEPENDS_ON_RESPONSIBILITIES
    : ADD_RESPONSIBILITY_DEPENDS_ON_RESPONSIBILITIES;

  const [addNeedDependency, { loading: loadingAddNeed }] = useMutation(ADD_NEED_DEPENDENCY);
  const [
    addResponsibilityDependency,
    { loading: loadingAddResponsibility },
  ] = useMutation(ADD_RESPONSIBILITY_DEPENDENCY);

  return (
    <FormGroup>
      <Label for="editDetailsTitle">
        Add dependency
      </Label>
      <TypeaheadInput
        placeholder="Search needs and responsibilities"
        disabled={loadingAddNeed || loadingAddResponsibility}
        searchQuery={gql`
          query AddDependency_searchNeedsAndResponsibilities($term: String!) {
            needs(search: $term) {
              nodeId
              title
            }
            responsibilities(search: $term) {
              nodeId
              title
            }
          }
        `}
        queryDataToResultsArray={data => [
          ...(data.needs || []),
          ...(data.responsibilities || []),
        ]}
        itemToString={i => (i && i.title) || ''}
        itemToResult={i => (
          <span>
            <TypeBadge nodeType={i.__typename} />
            {i.title}
          </span>
        )}
        onChange={(node, { reset, clearSelection }) => {
          clearSelection();
          reset();
          if (node.__typename === 'Need') {
            addNeedDependency({
              variables: {
                from: { nodeId },
                to: { nodeId: node.nodeId },
              },
            });
          } else {
            addResponsibilityDependency({
              variables: {
                from: { nodeId },
                to: { nodeId: node.nodeId },
              },
            });
          }
        }}
      />
    </FormGroup>
  );
};

AddDependency.propTypes = {
  nodeType: PropTypes.string,
  nodeId: PropTypes.string,
};

AddDependency.defaultProps = {
  nodeType: 'Need',
  nodeId: '',
};

export default AddDependency;
