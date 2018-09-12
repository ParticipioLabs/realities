import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import styled from 'styled-components';
import { RIETextArea } from 'riek';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const LabelSpan = styled.span`
  font-weight: bold;
  margin-right: 0.5em;
`;

const DescriptionDiv = styled.div`
  border: none;
  padding-left: 0;
  margin-bottom: 1em;
`;

class DescriptionField extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = this.props.data.description && this.isStringAcceptable(this.props.data.description)
      ? this.props
      : { data: { description: 'No description yet ...' } };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props && nextProps.data) {
      const data =
      nextProps.data.description
        ? nextProps.data
        : { description: 'No description yet ...' };
      this.setState({ data });
    }
  }

  handleChange = async (event) => {
    const { description } = event;
    await this.setState({ data: { description } });
    await this.updateDescriptionMutation();
    this.props.refetchData();
  };

  updateDescriptionMutation = async () => {
    const { description } = this.state.data;
    await this.props.updateDescriptionMutation({
      variables: {
        description,
        nodeId: this.props.nodeId,
      },
    });
  };

  isStringAcceptable = string => _.isString && string.length >= 1;

  render() {
    const { data } = this.state;
    return (
      <DescriptionDiv>
        <div><LabelSpan>Description:</LabelSpan></div>
        <RIETextArea
          value={data.description}
          change={this.handleChange}
          propName="description"
          classEditing="form-control"
          validate={this.isStringAcceptable}
          editProps={{ placeholder: 'Description' }}
        />
      </DescriptionDiv>
    );
  }
}

const EDIT_DESCRIPTION_MUTATION = gql`
  mutation UpdateDescriptionMutation($nodeId: ID!, $description: String!) {
    updateDescription(
      nodeId: $nodeId,
      description: $description
    )
    {
      nodeId,
      description
    }
  }
`;

DescriptionField.propTypes = {
  refetchData: PropTypes.func,
  updateDescriptionMutation: PropTypes.func,
  data: PropTypes.shape({
    description: PropTypes.string,
  }),
  nodeId: PropTypes.string,
};

DescriptionField.defaultProps = {
  refetchData: PropTypes.func.isRequired,
  updateDescriptionMutation: PropTypes.func.isRequired,
  data: { description: '' },
  nodeId: PropTypes.string.isRequired,
};

export default graphql(
  EDIT_DESCRIPTION_MUTATION,
  {
    name: 'updateDescriptionMutation',
  },
)(DescriptionField);
