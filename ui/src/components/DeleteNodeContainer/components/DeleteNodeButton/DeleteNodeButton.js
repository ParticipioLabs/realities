import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
} from 'reactstrap';

const Wrapper = styled.div`
  margin-bottom: 1rem;
`;

const DeleteNodeButton = ({
  nodeType,
  confirmationModalIsOpen,
  onToggleConfirmationModal,
  onConfirmSoftDelete,
  loading,
  error,
}) => (
  <Wrapper>
    <Button
      color="danger"
      onClick={onToggleConfirmationModal}
      disabled={loading}
    >
      Delete
      {' '}
      {nodeType.toLowerCase()}
    </Button>
    {error && (
      <p className="text-danger">
        {error}
      </p>
    )}
    <Modal
      isOpen={confirmationModalIsOpen}
      toggle={onToggleConfirmationModal}
    >
      <ModalBody>
        Are you sure you want to delete this
        {' '}
        {nodeType.toLowerCase()}
        ?
      </ModalBody>
      <ModalFooter>
        <Button
          color="danger"
          onClick={onConfirmSoftDelete}
          disabled={loading}
        >
          Yes, delete this
          {' '}
          {nodeType.toLowerCase()}
        </Button>
        <Button color="link" onClick={onToggleConfirmationModal}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  </Wrapper>
);

DeleteNodeButton.propTypes = {
  nodeType: PropTypes.string,
  confirmationModalIsOpen: PropTypes.bool,
  onToggleConfirmationModal: PropTypes.func,
  onConfirmSoftDelete: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.string,
};

DeleteNodeButton.defaultProps = {
  nodeType: 'Need',
  confirmationModalIsOpen: false,
  onToggleConfirmationModal: () => null,
  onConfirmSoftDelete: () => null,
  loading: false,
  error: '',
};

export default DeleteNodeButton;
