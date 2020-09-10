import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { withRouter } from 'react-router-dom';
import { Mutation } from '@apollo/client/react/components';
import { GET_NEEDS, GET_RESPONSIBILITIES, SET_CACHE } from '@/services/queries';
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

class DeleteNodeContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirmationModalIsOpen: false,
    };
  }

  toggleConfirmationModal = () => {
    this.setState({ confirmationModalIsOpen: !this.state.confirmationModalIsOpen });
  };

  render() {
    return (
      <Mutation
        mutation={this.props.nodeType === 'Need' ? SOFT_DELETE_NEED : SOFT_DELETE_RESPONSIBILITY}
        update={(cache, { data }) => {
          this.setState({ confirmationModalIsOpen: false });
          cache.writeQuery({
            query: SET_CACHE,
            data: {
              showDetailedEditView: false,
            },
          });

          if (this.props.nodeType === 'Need') {
            const { needs } = cache.readQuery({ query: GET_NEEDS });
            cache.writeQuery({
              query: GET_NEEDS,
              data: {
                needs: needs.filter(n => n.nodeId !== data.softDeleteNeed.nodeId),
              },
            });
            this.props.history.push('/');
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
            this.props.history.push(`/${needId}`);
          }
        }}
      >
        {(softDeleteNode, { loading, error }) => (
          <DeleteNodeButton
            nodeType={this.props.nodeType}
            confirmationModalIsOpen={this.state.confirmationModalIsOpen}
            onToggleConfirmationModal={this.toggleConfirmationModal}
            onConfirmSoftDelete={() => softDeleteNode({ variables: { nodeId: this.props.nodeId } })}
            loading={loading}
            error={error}
          />
        )}
      </Mutation>
    );
  }
}

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
