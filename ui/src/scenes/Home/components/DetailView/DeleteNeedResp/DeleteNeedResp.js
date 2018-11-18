import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { graphql } from 'react-apollo';
import styled from 'styled-components';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

const DeleteButton = styled(Button)`
  border-bottom: 1px dotted;
  display: inline-block;
`;

class DeleteNeedResp extends Component {
  constructor(props) {
    super(props);
    this.deleteNeedRespMutation = this.deleteNeedRespMutation.bind(this);
    this.deleteNode = this.deleteNode.bind(this);
  }

  deleteNode = () => {
    const node = this.props.data;
    if (node.__typename === 'Need' && node.fulfilledBy) {
      console.log(node);
      if (node.fulfilledBy.length < 1) {
        this.deleteNeedRespMutation();
      } else {
        alert('Cannot delete Need with Responsibilities!');
      }
    }
  }

  deleteNeedRespMutation = async () => {
    console.log(this);
    await this.props.deleteNeedRespMutation({
      variables: {
        nodeId: this.props.data.nodeId,
      },
    });
    console.log('Deleted node');
    this.props.onSelectNeedResp(null);
  }

  renderButton() {
    return (
      <DeleteButton
        onClick={() => this.deleteNode()}
        color="danger"
      >
        {this.props.data.__typename === 'Need' ? 'Delete Need' : 'Delete Responsibility'}
      </DeleteButton>
    );
  }

  render() {
    return (
      this.renderButton()
    );
  }
}

const DELETE_MUTATION = gql`
  mutation DeleteNeedRespMutation($nodeId: ID!) {
    deleteNeedResp(
      node: $nodeId
    ) 
    {
      nodeId,
      isDeleted
    }
  }
`;

DeleteNeedResp.propTypes = {
  data: PropTypes.shape({
    nodeId: PropTypes.string,
    __typename: PropTypes.string,
  }),
  deleteNeedRespMutation: PropTypes.func,
  onSelectNeedResp: PropTypes.func,
};

DeleteNeedResp.defaultProps = {
  data: { nodeId: '' },
  deleteNeedRespMutation: PropTypes.func.isRequired,
  onSelectNeedResp: PropTypes.func.isRequired,
};

export default graphql(
  DELETE_MUTATION,
  {
    name: 'deleteNeedRespMutation',
  },
)(DeleteNeedResp);
