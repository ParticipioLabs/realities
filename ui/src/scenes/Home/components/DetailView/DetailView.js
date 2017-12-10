import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'reactstrap';

const DetailView = ({ data }) => {
  console.log(data);
  return (
    <div>
      <h4>Details</h4>
      <h5>{data && data.title}</h5>
      <p>{data && data.description}</p>
      <Badge color={data && data.__typename === 'Responsibility' ? 'green' : 'purple'}>{data && data.__typename}</Badge>
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
