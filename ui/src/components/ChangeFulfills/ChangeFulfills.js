import React from 'react';
import { gql } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ListGroupItem, Button, FormGroup, Label } from 'reactstrap';
import { withRouter } from 'react-router-dom';

import { GET_RESPONSIBILITIES } from '@/services/queries';
import TypeaheadInput from '@/components/TypeaheadInput';
import TypeBadge from '@/components/TypeBadge';

const StyledFormGroup = styled(FormGroup)`
  margin-bottom: 2em;
`;

const ButtonWrapper = styled.span`
  position: absolute;
  top: 0.54em;
  right: 0.54em;
`;

const CHANGE_FULFILLS = gql`
  mutation changeFulfills($responsibilityId: ID!, $needId: ID!) {
    changeFulfills(responsibilityId: $responsibilityId, needId: $needId) {
      nodeId
      title
      fulfills {
        nodeId
      }
    }
  }
`;

class ChangeFulfills extends React.Component {
  state = { editing: false };

  toggleEdit = () => this.setState({ editing: !this.state.editing });

  render() {
    const { node, history } = this.props;
    return (
      <StyledFormGroup>
        <Label>Fulfills</Label>
        <Mutation
          mutation={CHANGE_FULFILLS}
          update={(cache, { data: { changeFulfills } }) => {
            const { responsibilities } = cache.readQuery({
              query: GET_RESPONSIBILITIES,
              variables: { needId: node.fulfills.nodeId },
            });

            cache.writeQuery({
              query: GET_RESPONSIBILITIES,
              variables: {
                needId: node.fulfills.nodeId,
              },
              data: {
                responsibilities: responsibilities.filter(i => i.nodeId !== changeFulfills.nodeId),
              },
            });
          }}
        >
          {changeOwner => (
            <div>
              {this.state.editing ? (
                <TypeaheadInput
                  placeholder="Search needs"
                  searchQuery={gql`
                    query ChangeOwner_searchNeeds($term: String!) {
                      needs(search: $term) {
                        nodeId
                        title
                      }
                    }
                  `}
                  autoFocus
                  onBlur={() => this.toggleEdit()}
                  selectedItem={node.fulfills}
                  queryDataToResultsArray={data => [...(data.needs || [])]}
                  itemToString={i => (i && i.title) || ''}
                  itemToResult={i => (
                    <span>
                      <TypeBadge nodeType={i.__typename} />
                      {i.title}
                    </span>
                  )}
                  onChange={(selectedNode) => {
                    if (selectedNode) {
                      changeOwner({
                        variables: {
                          responsibilityId: node.nodeId,
                          needId: selectedNode.nodeId,
                        },
                      });
                      this.toggleEdit();
                    }
                  }}
                />
              ) : (
                <ListGroupItem onClick={() => history.push(`/${node.fulfills.nodeId}`)} action>
                  <TypeBadge nodeType={node.fulfills.__typename} />
                  {node.fulfills.title}
                  <ButtonWrapper>
                    <Button
                      size="sm"
                      color="primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        this.toggleEdit();
                      }}
                    >
                      Change
                    </Button>
                  </ButtonWrapper>
                </ListGroupItem>
              )}
            </div>
          )}
        </Mutation>
      </StyledFormGroup>
    );
  }
}

ChangeFulfills.propTypes = {
  node: PropTypes.shape({
    __typename: PropTypes.string,
    nodeId: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    deliberations: PropTypes.arrayOf(PropTypes.shape({
      __typename: PropTypes.string,
      nodeId: PropTypes.string,
      title: PropTypes.string,
    })),
    guide: PropTypes.shape({
      nodeId: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
    }),
    realizer: PropTypes.shape({
      nodeId: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
    }),
    dependsOnNeeds: PropTypes.arrayOf(PropTypes.shape({
      __typename: PropTypes.string,
      nodeId: PropTypes.string,
      title: PropTypes.string,
    })),
    dependsOnResponsibilities: PropTypes.arrayOf(PropTypes.shape({
      __typename: PropTypes.string,
      nodeId: PropTypes.string,
      title: PropTypes.string,
      fulfills: PropTypes.shape({
        nodeId: PropTypes.string,
      }),
    })),
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

ChangeFulfills.defaultProps = {
  node: {
    nodeId: '',
    title: '',
    description: '',
    deliberations: [],
    guide: {
      nodeId: '',
      email: '',
      name: '',
    },
    realizer: {
      nodeId: '',
      email: '',
      name: '',
    },
    dependsOnNeeds: [],
    dependsOnResponsibilities: [],
  },
  history: {
    push: () => null,
  },
};

export default withRouter(ChangeFulfills);
