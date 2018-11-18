import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { FormGroup, Label } from 'reactstrap';
import InfoForm from '@/components/InfoForm';
import TypeBadge from '@/components/TypeBadge';

const ADD_REALITY_HAS_DELIBERATION = gql`
  mutation AddDeliberation_addHasDeliberationMutation(
    $from: _RealityInput!
    $to: _InfoInput!
  ) {
    addHasDeliberation(from: $from, to: $to) {
      from {
        nodeId
        hasDeliberation {
          nodeId
          title
          url
        }
      }
    }
  }
`;
//minimal reading list, integrating participio

//const ADD_NEED_DEPENDS_ON_RESPONSIBILITIES = gql`
//  mutation AddDeliberation_addNeedDependsOnResponsibilitiesMutation(
//    $from: _NeedInput!
//    $to: _ResponsibilityInput!
//  ) {
//    addNeedDependsOnResponsibilities(from: $from, to: $to) {
//      from {
//        nodeId
//        dependsOnResponsibilities {
//          nodeId
//          title
//          fulfills {
//            nodeId
//          }
//        }
//      }
//    }
//  }
//`;
//
//const ADD_RESPONSIBILITY_DEPENDS_ON_NEEDS = gql`
//  mutation AddDeliberation_addResponsibilityDependsOnNeedsMutation(
//    $from: _ResponsibilityInput!
//    $to: _NeedInput!
//  ) {
//    addResponsibilityDependsOnNeeds(from: $from, to: $to) {
//      from {
//        nodeId
//        dependsOnNeeds {
//          nodeId
//          title
//        }
//      }
//    }
//  }
//`;
//
//const ADD_RESPONSIBILITY_DEPENDS_ON_RESPONSIBILITIES = gql`
//  mutation AddDeliberation_addResponsibilityDependsOnResponsibilitiesMutation(
//    $from: _ResponsibilityInput!
//    $to: _ResponsibilityInput!
//  ) {
//    addResponsibilityDependsOnResponsibilities(from: $from, to: $to) {
//      from {
//        nodeId
//        dependsOnResponsibilities {
//          nodeId
//          title
//          fulfills {
//            nodeId
//          }
//        }
//      }
//    }
//  }
//`;

const AddDeliberation = ({ nodeType, nodeId }) => {
  const ADD_NEED_DEPENDENCY = nodeType === 'Need'
    ? ADD_NEED_DEPENDS_ON_NEEDS
    : ADD_RESPONSIBILITY_DEPENDS_ON_NEEDS;
  const ADD_RESPONSIBILITY_DEPENDENCY = nodeType === 'Need'
    ? ADD_NEED_DEPENDS_ON_RESPONSIBILITIES
    : ADD_RESPONSIBILITY_DEPENDS_ON_RESPONSIBILITIES;
  return (
    <Mutation mutation={ADD_NEED_DEPENDENCY}>
      {(addNeedDeliberation, { loading: loadingAddNeed }) => (
        <Mutation mutation={ADD_RESPONSIBILITY_DEPENDENCY}>
          {(addResponsibilityDeliberation, { loading: loadingAddResponsibility }) => (
            <FormGroup>
              <Label for="editDetailsTitle">
                Add dependency
              </Label>
              <InfoForm
                placeholder="Search needs and responsibilities"
                disabled={loadingAddNeed || loadingAddResponsibility}
                searchQuery={gql`
                  query AddDeliberation_searchNeedsAndResponsibilities($term: String!) {
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
                    addNeedDeliberation({
                      variables: {
                        from: { nodeId },
                        to: { nodeId: node.nodeId },
                      },
                    });
                  } else {
                    addResponsibilityDeliberation({
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

AddDeliberation.propTypes = {
  nodeType: PropTypes.string,
  nodeId: PropTypes.string,
};

AddDeliberation.defaultProps = {
  nodeType: 'Info',
  nodeId: '',
};

export default AddDeliberation;
