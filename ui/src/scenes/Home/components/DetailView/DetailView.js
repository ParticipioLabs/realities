import React from 'react';
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

const DetailView = ({ data }) => {
  console.log(data);
  if (data && data.title) {
    return (
      <Card>
        <CardBody>
          <Title><RIEInput
            value={data.title}
            change={data => onEditTitle(data)}
            propName="title"
            validate={_.isString}
          />
          </Title>
          <Label color={data && data.__typename === 'Responsibility' ? 'green' : 'purple'}>{data && data.__typename}</Label>
          <CardText>
            {data.description ? <RIETextArea
              value={data.description}
              change={data => onEditDescription(data)}
              propName="description"
              validate={_.isString}
            /> : <div /> }
          </CardText>
        </CardBody>
      </Card>
    );
  }
  return <div />;
};

function onEditTitle(data) {
  console.log(`changed ${data.title}`);
}

function onEditDescription(data) {
  console.log(`changed ${data.description}`);
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
