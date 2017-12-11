import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardText, CardBody, CardTitle } from 'reactstrap';
import styled from 'styled-components';
import { RIEInput, RIETextArea } from 'riek';
import _ from 'lodash';

const Label = styled.span`
  border-radius: 4px;
  background-color: ${props => props.color};
  padding: 5px;
  display: inline-block;
  color: white;
  float: right;
`;

const Title = styled(CardTitle)`
  border-bottom: 1px dotted;
  display: inline-block;
`;

const Description = styled(CardText)`
  width: 100%;
`;


class DetailView extends Component {
  state = { data: undefined };

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props && nextProps.data) {
      const { data } = nextProps;
      this.setState({ data });
    }
  }

  render() {
    if (this.state.data) {
      const { data } = this.state;
      return (
        <Card>
          <CardBody>
            <Title><RIEInput
              value={data.title}
              change={newData => this.setState({ data: { title: newData.title } })}
              propName="title"
              validate={_.isString}
            />
            </Title>
            <Label color={data && data.typename === 'Responsibility' ? 'green' : 'purple'}>{data && data.typename}</Label>
            <Description>
              {data.description ? <RIETextArea
                value={data.description}
                change={newData => this.setState({ data: { description: newData.description } })}
                propName="description"
                validate={_.isString}
              /> : <div /> }
            </Description>
          </CardBody>
        </Card>
      );
    }
    return <div />;
  }
}

DetailView.defaultProps = {
  data: { title: '', description: '' },
};

DetailView.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
  }),
};

export default DetailView;
