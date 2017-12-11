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
    background-color: ${props => (props.selected ? '#843cfd' : '#fff')};
    color: ${props => (props.selected ? '#fff' : '#666')};
`;

const renderListItems = (responsibilities, onSelectResponsibility, selectedResp) => {
  if (responsibilities) {
    return responsibilities.map((responsibility, i) => {
      const selected = responsibility === selectedResp;
      return (
        <RealitiesListGroupItem
                // eslint-disable-next-line react/no-array-index-key
          key={i}
          selected={selected}
          onClick={() => onSelectResponsibility(responsibility)}
        >

          {responsibility.title}
        </RealitiesListGroupItem>
      );
    });
  }
  return null;
};
        /*
const ResponsibilitiesList = ({ responsibilities, onSelectResponsibility }) => (
  <div>
    <RealitiesListHeader>Responsibilities</RealitiesListHeader>
    <ListGroup>
      {responsibilities && responsibilities.map((responsibility, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <RealitiesListGroupItem key={i} onClick={() => onSelectResponsibility(responsibility)}>
*/

const ResponsibilitiesList = ({ responsibilities, onSelectResponsibility, selectedResp }) => (
  <div>
    <RealitiesListHeader>Responsibilities</RealitiesListHeader>
    <ListGroup>
      {renderListItems(responsibilities, onSelectResponsibility, selectedResp)}
    </ListGroup>
  </div>
);

ResponsibilitiesList.defaultProps = {
  responsibilities: [],
  selectedResp: {},
};

ResponsibilitiesList.propTypes = {
  responsibilities: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  onSelectResponsibility: PropTypes.func.isRequired,
  selectedResp: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};


export default ResponsibilitiesList;
