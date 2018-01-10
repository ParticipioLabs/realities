import React, { Component } from 'react';
import {
  Input,
  InputGroup,
  InputGroupButton,
  Badge,
} from 'reactstrap';
import { CreateNeedInput } from '@/styles/realities-styles';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const RealitiesBadge = styled(Badge)`
  padding-top: 1em;
  padding-left: 1em;
  padding-right: 1em; 
  background-color: #00cf19;
`;

class CreateNeed extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      placeholder: 'Title of new need',
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

  createNeedMutation = async () => {
    const createdNeed = await this.props.createNeedMutation({
      variables: {
        title: this.state.title,
      },
    });
    this.props.toggleCreateNewNeed(createdNeed.data.createNeed);
  }
  renderField() {
    return (
      <CreateNeedInput>
        <InputGroup>
          <RealitiesBadge> {'N'} </RealitiesBadge>
          <Input placeholder={this.state.placeholder} onChange={this.handleNameChange} />
          <InputGroupButton onClick={() => this.createNeedMutation()} color="secondary">Create</InputGroupButton>
        </InputGroup>
      </CreateNeedInput>
    );
  }

  render() {
    const { newNeed } = this.props;
    return newNeed ? this.renderField() : <div />;
  }
}

const CREATE_TEXT_MUTATION = gql`
  mutation CreateTitleMutation($title: String!) {
    createNeed(
      title: $title
    ) {
      title,
      nodeId
    }
  }
`;

CreateNeed.propTypes = {
  newNeed: PropTypes.bool,
  createNeedMutation: PropTypes.func,
  toggleCreateNewNeed: PropTypes.func,
};

CreateNeed.defaultProps = {
  newNeed: false,
  createNeedMutation: PropTypes.func.isRequired,
  toggleCreateNewNeed: PropTypes.func.isRequired,
};

export default graphql(
  CREATE_TEXT_MUTATION,
  {
    name: 'createNeedMutation',
  },
)(CreateNeed);

