import React from 'react';
import PropTypes from 'prop-types';

import { ListGroup, ListGroupItem } from 'reactstrap';

const ResponsibilitiesList = ({ responsibilities, onSelectResponsibility }) => (
  <div>
    <h4>Responsibilities</h4>
    <ListGroup>
      {responsibilities && responsibilities.map((responsibility, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <ListGroupItem key={i} onClick={() => onSelectResponsibility(responsibility)}>
          {responsibility.title}
        </ListGroupItem>
      ))}
    </ListGroup>
  </div>
);

ResponsibilitiesList.defaultProps = {
  responsibilities: [],
};

ResponsibilitiesList.propTypes = {
  responsibilities: PropTypes.array,
  onSelectResponsibility: PropTypes.func.isRequired,
}


export default ResponsibilitiesList;
