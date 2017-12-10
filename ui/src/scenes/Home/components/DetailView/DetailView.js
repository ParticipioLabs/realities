import React from 'react';
import PropTypes from 'prop-types';
import { Badge, Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button  } from 'reactstrap';
import styled from 'styled-components';

const Label = styled.span`
  border-radius: 4px;
  background-color: ${props => props.color};
  padding: 5px;
  display: inline-block;
  color: white;
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
};

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
