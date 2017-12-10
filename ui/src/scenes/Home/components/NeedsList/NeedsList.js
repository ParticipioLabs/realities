import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem } from 'reactstrap';

const NeedsList = ({ needs, onSelectNeed }) => (
  <div>
    <h4>Needs</h4>
    <ListGroup>
      {needs && needs.map((need, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <ListGroupItem key={i} onClick={() => onSelectNeed(need)}>
          {need.title}
        </ListGroupItem>
      ))}
    </ListGroup>
  </div>
);

NeedsList.defaultProps = {
  needs: [],
};

NeedsList.propTypes = {
  needs: PropTypes.array,
  onSelectNeed: PropTypes.func.isRequired,
};

export default NeedsList;
