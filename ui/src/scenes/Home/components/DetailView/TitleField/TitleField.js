import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _ from 'lodash';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { RIEInput } from 'riek';
import { CardTitle } from 'reactstrap';

const Title = styled(CardTitle)`
  border-bottom: 1px dotted;
  display: inline-block;
`;

class TitleField extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.updateTitleMutation = this.updateTitleMutation.bind(this);
  }

  state = { data: this.props.data };
  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props && nextProps.data) {
      const { data } = nextProps;
      this.setState({ data });
    }
  }

  async handleChange(event) {
    const { title } = event;
    await this.setState({ data: { title } });
    await this.updateTitleMutation();
    this.props.refetchData();
  }

  updateTitleMutation = async () => {
    const { title } = this.state.data;
    await this.props.updateTitleMutation({
      variables: {
        title,
        nodeId: this.props.nodeId,
      },
    });
  }

  isStringAcceptable = string => _.isString && string.length >= 1 && string.length <= 100;

  render() {
    if (this.state.data) {
      const { data } = this.state;
      return (
        <Title>
          <RIEInput
            value={data.title}
            change={this.handleChange}
            propName="title"
            validate={this.isStringAcceptable}
          />
        </Title>
      );
    }
    return <Title />;
  }
}

const EDIT_TITLE_MUTATION = gql`
  mutation UpdateTitleMutation($nodeId: ID!, $title: String!) {
    updateTitle(
      nodeId: $nodeId,
      title: $title
    ) 
    {
      nodeId,
      title
    }
  }
`;

TitleField.propTypes = {
  refetchData: PropTypes.func,
  updateTitleMutation: PropTypes.func,
  data: PropTypes.shape({
    title: PropTypes.string,
  }),
  nodeId: PropTypes.string,
};

TitleField.defaultProps = {
  refetchData: PropTypes.func.isRequired,
  updateTitleMutation: PropTypes.func.isRequired,
  data: { title: '' },
  nodeId: PropTypes.string.isRequired,
};

export default graphql(
  EDIT_TITLE_MUTATION,
  {
    name: 'updateTitleMutation',
  },
)(TitleField);
