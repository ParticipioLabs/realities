import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
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
  return (
    <Mutation mutation={ADD_NEED_DEPENDENCY}>
      {(addNeedDependency, { loading: loadingAddNeed }) => (
        <Mutation mutation={ADD_RESPONSIBILITY_DEPENDENCY}>
          {(addResponsibilityDependency, { loading: loadingAddResponsibility }) => (
            <FormGroup>
              <Label for="editDetailsTitle">
                Add dependency
              </Label>
              <TypeaheadInput
                placeholder="Search needs and responsibilities"
                disabled={loadingAddNeed || loadingAddResponsibility}
                searchQuery={gql`
                  query AddDependency_searchNeedsAndResponsibilities($term: String!) {
                    searchNeedsAndResponsibilities(term: $term) {
                      needs {
                        nodeId
                        title
                      }
                      responsibilities {
                        nodeId
                        title
                      }
                    }
                  }
                `}
                queryDataToResultsArray={(data) => {
                  const searchResultObject = data.searchNeedsAndResponsibilities || {};
                  return [
                    ...(searchResultObject.needs || []),
                    ...(searchResultObject.responsibilities || []),
                  ];
                }}
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
          )}
        </Mutation>
      )}
    </Mutation>
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
