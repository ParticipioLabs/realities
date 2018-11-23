import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { GET_NEEDS, GET_NEED_RESPONSIBILITIES } from '@/services/queries';
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
    const { node } = this.props;
    return (
      <Mutation
        mutation={node.__typename === 'Need' ? SOFT_DELETE_NEED : SOFT_DELETE_RESPONSIBILITY}
        update={(cache, { data }) => {
          this.setState({ confirmationModalIsOpen: false });
          cache.writeData({ data: { showDetailedEditView: false } });
          if (node.__typename === 'Need') {
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
            const { need } = cache.readQuery({
              query: GET_NEED_RESPONSIBILITIES,
              variables: { needId },
            });
            cache.writeQuery({
              query: GET_NEED_RESPONSIBILITIES,
              variables: { needId },
              data: {
                need: {
                  __typename: 'Need',
                  nodeId: needId,
                  fulfilledBy: need
                    .fulfilledBy
                    .filter(r => r.nodeId !== data.softDeleteResponsibility.nodeId),
                },
              },
            });
            this.props.history.push(`/${needId}`);
          }
        }}
      >
        {(softDeleteNode, { loading, error }) => {
          let isNeedandHasResponsibilities = false;
          if (node.__typename === 'Need') {
            isNeedandHasResponsibilities = node.fulfilledBy.length > 0;
          }

          return (
            <DeleteNodeButton
              nodeType={node.__typename}
              confirmationModalIsOpen={this.state.confirmationModalIsOpen}
              onToggleConfirmationModal={this.toggleConfirmationModal}
              onConfirmSoftDelete={() => softDeleteNode({ variables: { nodeId: node.nodeId } })}
              disabled={loading || isNeedandHasResponsibilities}
              error={error}
            />
          );
        }}
      </Mutation>
    );
  }
}

DeleteNodeContainer.propTypes = {
  node: PropTypes.shape({
    __typename: PropTypes.string,
    nodeId: PropTypes.string,
    fulfilledBy: PropTypes.arrayOf(PropTypes.shape({
      nodeId: PropTypes.string,
    })),
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

DeleteNodeContainer.defaultProps = {
  node: {
    __typename: 'need',
    nodeId: '',
    fulfilledBy: [],
  },
  history: {
    push: () => null,
  },
};

export default withRouter(DeleteNodeContainer);
