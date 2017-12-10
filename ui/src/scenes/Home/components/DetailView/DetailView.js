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
  margin-left: 10px;
`;

const Title = styled.h5`
  border-bottom: 1px dotted;
  display: inline-block;
`;

const DetailView = ({ data }) => {
  console.log(data);
  return (
    <Card>
      <CardBody>
        <CardTitle><Label color={data && data.__typename === 'Responsibility' ? '#843cfd' : '#00cf19'}>{data && data.__typename}</Label> {data && data.title} </CardTitle>
        <CardText>{data && data.description}</CardText>
      </CardBody>
    </Card>
  );

  /*
  Arvin 2017-12-10
  Code needs to be tested
  Merge when server is back up

  if (data && data.title) {
    return (
      <div>
        <h4>Details</h4>
        <Title><RIEInput
          value={data.title}
          change={data => onEditTitle(data)}
          propName="title"
          validate={_.isString}
        />
        </Title>
        <Label color={data && data.__typename === 'Responsibility' ? 'green' : 'purple'}>{data && data.__typename}</Label>
        <p>
          {data.description ? <RIETextArea
            value={data.description}
            change={data => onEditDescription(data)}
            propName="description"
            validate={_.isString}
          /> : <div /> }
        </p>
      </div>
    );
  }
  return <div />;

  */
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
