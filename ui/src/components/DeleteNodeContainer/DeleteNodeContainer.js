import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { gql, useMutation } from '@apollo/client';
import { withRouter } from 'react-router-dom';
import { GET_NEEDS, GET_RESPONSIBILITIES, SET_CACHE } from 'services/queries';
import DeleteNodeButton from './components/DeleteNodeButton';

const SOFT_DELETE_NEED = gql`
  mutation DeleteNodeContainer_softDeleteNeed($nodeId: ID!) {
    softDeleteNeed(nodeId: $nodeId) {
      nodeId
      deleted
    }
  }
`;

const SOFT_DELETE_RESPONSIBILITY = gql`
  mutation DeleteNodeContainer_softDeleteResponsibility($nodeId: ID!) {
    softDeleteResponsibility(nodeId: $nodeId) {
      nodeId
      deleted
      fulfills {
        nodeId
      }
    }
  }
`;

const DeleteNodeContainer = ({ nodeType, nodeId, history }) => {
  const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);
  const [
    softDeleteNode,
    { loading, error },
  ] = useMutation(
    nodeType === 'Need' ? SOFT_DELETE_NEED : SOFT_DELETE_RESPONSIBILITY,
    {
      update: (cache, { data }) => {
        setConfirmationModalIsOpen(false);
        cache.writeQuery({
          query: SET_CACHE,
          data: {
            showDetailedEditView: false,
          },
        });

        if (nodeType === 'Need') {
          const { needs } = cache.readQuery({ query: GET_NEEDS });
          cache.writeQuery({
            query: GET_NEEDS,
            data: {
              needs: needs.filter(n => n.nodeId !== data.softDeleteNeed.nodeId),
            },
          });
          history.push('/');
        } else {
          const needId = data.softDeleteResponsibility.fulfills.nodeId;
          const { responsibilities } = cache.readQuery({
            query: GET_RESPONSIBILITIES,
            variables: { needId },
          });
          cache.writeQuery({
            query: GET_RESPONSIBILITIES,
            variables: { needId },
            data: {
              responsibilities: responsibilities
                .filter(r => r.nodeId !== data.softDeleteResponsibility.nodeId),
            },
          });
          history.push(`/${needId}`);
        }
      },
    },
  );

  return (
    <DeleteNodeButton
      nodeType={nodeType}
      confirmationModalIsOpen={confirmationModalIsOpen}
      onToggleConfirmationModal={() => setConfirmationModalIsOpen(!confirmationModalIsOpen)}
      onConfirmSoftDelete={() => softDeleteNode({ variables: { nodeId } })}
      loading={loading}
      error={error}
    />
  );
};

DeleteNodeContainer.propTypes = {
  nodeType: PropTypes.string,
  nodeId: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

DeleteNodeContainer.defaultProps = {
  nodeType: 'Need',
  nodeId: '',
  history: {
    push: () => null,
  },
};

export default withRouter(DeleteNodeContainer);
