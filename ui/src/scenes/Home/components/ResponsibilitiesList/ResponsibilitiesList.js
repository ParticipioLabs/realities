import React from 'react';
import PropTypes from 'prop-types';

import { ListGroup, ListGroupItem } from 'reactstrap';
import styled from 'styled-components';

const RealitiesListHeader = styled.p`
      font-size: 1.5em;
      padding: .5em 0 .5em 0;
      color: #fff;
      text-align:center;
      background-color: #843cfd;
`;
const RealitiesListGroupItem = styled(ListGroupItem)`
  .active {
    background-color: #843cfd;
    color: #fff;
    }
`

const ResponsibilitiesList = ({ responsibilities, onSelectResponsibility }) => (
  <div>
    <RealitiesListHeader>Responsibilities</RealitiesListHeader>
    <ListGroup>
      {responsibilities && responsibilities.map((responsibility, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <RealitiesListGroupItem key={i} onClick={() => onSelectResponsibility(responsibility)}>
          {responsibility.title}
        </RealitiesListGroupItem>
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
