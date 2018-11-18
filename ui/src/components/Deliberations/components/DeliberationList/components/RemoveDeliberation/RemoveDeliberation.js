import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import {
  Button,
} from 'reactstrap';

const REMOVE_NEED_DEPENDS_ON_NEEDS = gql`
  mutation RemoveDeliberation_removeNeedDependsOnNeedsMutation(
    $from: _NeedInput!
    $to: _NeedInput!
  ) {
    removeNeedDependsOnNeeds(from: $from, to: $to) {
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

const REMOVE_NEED_DEPENDS_ON_RESPONSIBILITIES = gql`
  mutation RemoveDeliberation_removeNeedDependsOnResponsibilitiesMutation(
    $from: _NeedInput!
    $to: _ResponsibilityInput!
  ) {
    removeNeedDependsOnResponsibilities(from: $from, to: $to) {
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

const REMOVE_RESPONSIBILITY_DEPENDS_ON_NEEDS = gql`
  mutation RemoveDeliberation_removeResponsibilityDependsOnNeedsMutation(
    $from: _ResponsibilityInput!
    $to: _NeedInput!
  ) {
    removeResponsibilityDependsOnNeeds(from: $from, to: $to) {
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

const REMOVE_RESPONSIBILITY_DEPENDS_ON_RESPONSIBILITIES = gql`
  mutation RemoveDeliberation_removeResponsibilityDependsOnResponsibilitiesMutation(
    $from: _ResponsibilityInput!
    $to: _ResponsibilityInput!
  ) {
    removeResponsibilityDependsOnResponsibilities(from: $from, to: $to) {
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

const RemoveDeliberation = withRouter(({ match, nodeType, nodeId }) => {
  const fromType = match.params.responsibilityId ? 'Responsibility' : 'Need';
  const REMOVE_NEED_DEPENDENCY = fromType === 'Need'
    ? REMOVE_NEED_DEPENDS_ON_NEEDS
    : REMOVE_RESPONSIBILITY_DEPENDS_ON_NEEDS;
  const REMOVE_RESPONSIBILITY_DEPENDENCY = fromType === 'Need'
    ? REMOVE_NEED_DEPENDS_ON_RESPONSIBILITIES
    : REMOVE_RESPONSIBILITY_DEPENDS_ON_RESPONSIBILITIES;
  const REMOVE_DEPENDENCY = nodeType === 'Need'
    ? REMOVE_NEED_DEPENDENCY
    : REMOVE_RESPONSIBILITY_DEPENDENCY;
  return (
    <Mutation mutation={REMOVE_DEPENDENCY}>
      {(removeDeliberation, { loading }) => (
        <Button
          size="sm"
          color="danger"
          disabled={loading}
          onClick={(e) => {
            e.stopPropagation();
            removeDeliberation({
              variables: {
                from: { nodeId: match.params.responsibilityId || match.params.needId },
                to: { nodeId },
              },
            });
          }}
        >
          Remove
        </Button>
      )}
    </Mutation>
  );
});

RemoveDeliberation.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      needId: PropTypes.string,
      resposibilityId: PropTypes.string,
    }),
  }),
  nodeType: PropTypes.string,
  nodeId: PropTypes.string,
};

RemoveDeliberation.defaultProps = {
  match: {
    params: {
      needId: undefined,
      responsibilityId: undefined,
    },
  },
  nodeType: 'Need',
  nodeId: '',
};

export default RemoveDeliberation;
