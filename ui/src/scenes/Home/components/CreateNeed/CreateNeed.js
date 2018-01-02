import React, { Component } from 'react';
import {
  Input,
  InputGroup,
  InputGroupButton,
} from 'reactstrap';
import { CreateNeedInput } from '@/styles/realities-styles';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

class CreateNeed extends Component {
  createNeedMutation = async () => {
    await this.props.createNeedMutation({
      variables: {
        title: 'It works!!',
      },
    });
  }

  renderField() {
    return (
      <CreateNeedInput>
        <InputGroup>
          <Input placeholder="Title" />
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
      title
    }
  }
`;

CreateNeed.propTypes = {
  newNeed: PropTypes.bool,
  createNeedMutation: PropTypes.func,
};

CreateNeed.defaultProps = {
  newNeed: false,
  createNeedMutation: PropTypes.func.isRequired,
};

export default graphql(CREATE_TEXT_MUTATION, { name: 'createNeedMutation' })(CreateNeed);
