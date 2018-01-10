import React, { Component } from 'react';
import {
  Input,
  InputGroupButton,
  Badge,
} from 'reactstrap';
import { CreateResponsibilityInput } from '@/styles/realities-styles';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const NeedBadge = styled(Badge)`
  padding: .5em;
  margin-bottom: .5em;
  background-color: #00cf19;
`;

class CreateResponsibility extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      placeholder: 'Title of new responsibility',
    };
  }

  handleNameChange = (event) => {
    // NOTE: there probably needs to be a check for XSS attacks for any information
    // that the user enters.
    if (event.target.value === '') {
      return;
    }

    this.setState({ title: event.target.value });
  };

  createResponsibilityMutation = async () => {
    const createdResponsibility = await this.props.createResponsibilityMutation({
      variables: {
        title: this.state.title,
        needId: this.props.selectedNeed.nodeId,
      },
    });
    this.props.toggleCreateNewResponsibility(createdResponsibility.data.createResponsibility);
  }
  renderField() {
    return (
      <div>
        <NeedBadge> {this.props.selectedNeed.title} </NeedBadge>
        <CreateResponsibilityInput>
          <div className="input-group-prepend">
            <span className="input-group-text"> {'R'} </span>
          </div>
          <Input placeholder={this.state.placeholder} onChange={this.handleNameChange} />
          <InputGroupButton onClick={() => this.createResponsibilityMutation()} color="secondary">Create</InputGroupButton>
        </CreateResponsibilityInput>
      </div>
    );
  }

  render() {
    const { newResponsibility } = this.props;
    return newResponsibility ? this.renderField() : <div />;
  }
}

const CREATE_TEXT_MUTATION = gql`
  mutation CreateTitleMutation($title: String!, $needId: String!) {
    createResponsibility(
      title: $title
      needId: $needId
    ) {
      title,
      nodeId
    }
  }
`;

CreateResponsibility.propTypes = {
  selectedNeed: PropTypes.shape({
    nodeId: PropTypes.string,
    title: PropTypes.string,
  }),
  newResponsibility: PropTypes.bool,
  createResponsibilityMutation: PropTypes.func,
  toggleCreateNewResponsibility: PropTypes.func,
};

CreateResponsibility.defaultProps = {
  selectedNeed: { nodeId: '', title: '' },
  newResponsibility: false,
  createResponsibilityMutation: PropTypes.func.isRequired,
  toggleCreateNewResponsibility: PropTypes.func.isRequired,
};

export default graphql(
  CREATE_TEXT_MUTATION,
  {
    name: 'createResponsibilityMutation',
  },
)(CreateResponsibility);
