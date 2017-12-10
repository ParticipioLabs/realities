import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Badge, Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button } from 'reactstrap';
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
  constructor(props) {
    super(props);
    this.state = { newTitle: undefined, newDescription: undefined };
  }
  render() {
    const { data } = this.props;
    if (data) {
      return (
        <Card>
          <CardBody>
            <Title><RIEInput
              value={data.title}
              change={data => this.setState({ newTitle: data.title })}
              propName="title"
              validate={_.isString}
            />
            </Title>
            <Label color={data && data.__typename === 'Responsibility' ? 'green' : 'purple'}>{data && data.__typename}</Label>
            <Description>
              {data.description ? <RIETextArea
                value={data.description}
                change={data => this.setState({ newDescription: data.description })}
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
