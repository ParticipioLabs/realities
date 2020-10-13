import React from 'react';
import PropTypes from 'prop-types';
import { gql, useMutation } from '@apollo/client';
import { withRouter } from 'react-router-dom';
import {
  Button,
} from 'reactstrap';

const REMOVE_REALITY_HAS_DELIBERATION = gql`
  mutation RemoveDeliberation_removeRealityHasDeliberationMutation(
    $from: _RealityInput!
    $to: _InfoInput!
  ) {
    removeRealityHasDeliberation(from: $from, to: $to) {
      from {
        nodeId
        deliberations {
          nodeId
        }
      }
    }
  }
`;

const RemoveDeliberation = withRouter(({ match, url }) => {
  const [removeDeliberation, { loading }] = useMutation(REMOVE_REALITY_HAS_DELIBERATION);

  return (
    <Button
      size="sm"
      color="danger"
      disabled={loading}
      onClick={(e) => {
        e.stopPropagation();
        removeDeliberation({
          variables: {
            from: { nodeId: match.params.responsibilityId || match.params.needId },
            to: { url },
          },
        });
      }}
    >
      Remove
    </Button>
  );
});

RemoveDeliberation.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      needId: PropTypes.string,
      responsibilityId: PropTypes.string,
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
  nodeType: 'Info',
  nodeId: '',
};

export default RemoveDeliberation;
