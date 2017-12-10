import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'reactstrap';
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
    <div>
      <h4>Details</h4>
      <h5>{data && data.title} <Label color={data && data.__typename === 'Responsibility' ? 'green' : 'purple'}>{data && data.__typename}</Label></h5>
      <p>{data && data.description}</p>

    </div>
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
