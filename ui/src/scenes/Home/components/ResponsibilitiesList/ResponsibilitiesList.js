import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Card } from 'reactstrap';
import styled from 'styled-components';
import MdAddCircleOutline from 'react-icons/lib/md/add-circle-outline';

// Grabbed a "skew" 2D transfrom recipe from
// https://github.com/IanLunn/Hover/ 
const RealitiesCircleOutline = styled(MdAddCircleOutline)`
     display: inline-block;
     font-size: 1.5em;
     color: rgba(255, 255, 255, 0.50);
     vertical-align: middle;
     -webkit-transform: perspective(1px) translateZ(0);
     transform: perspective(1px) translateZ(0);
     box-shadow: 0 0 1px transparent;
     -webkit-transition-duration: 0.3s;
     transition-duration: 0.3s;
     -webkit-transition-property: transform;
     transition-property: transform;
     &:hover, &:focus {
         color: #fff;
     }
     &:active {
         color: #fff;
         -webkit-transform: skew(-10deg);
         transform: skew(-10deg);
     }
}
`
const RealitiesListHeader = styled(Card)`
      font-size: 1.5em;
      padding: 0.5em 0.5em 0.5em 0.5em;
      color: #fff;
      flex-direction: row;
      justify-content: space-between;
      background-color: #843cfd;
      margin-bottom:0.5em;
`;
const RealitiesListGroupItem = styled(ListGroupItem)`
  &.active { 
    background-color: #843cfd;
    border-color: #843cfd;
    color: #fff;
  }
`;

const renderListItems = (responsibilities, onSelectResponsibility, selectedResp) => {
  if (responsibilities) {
    return responsibilities.map((responsibility) => {
      const selected = responsibility === selectedResp;
      return (
        <RealitiesListGroupItem
          key={responsibility.nodeId}
          tag="a"
          href="#"
          action
          active={selected}
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

const ResponsibilitiesList = ({ responsibilities, onSelectResponsibility, selectedResp, createNewResponsibility }) => (
  <div>
    <RealitiesListHeader><span>Responsibilities</span>
    <a href="#" style={{display: (responsibilities ? 'inherit' : 'none')}} onClick={() => createNewResponsibility()}>
      <RealitiesCircleOutline></RealitiesCircleOutline>
    </a>
    </RealitiesListHeader>

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
  createNewResponsibility: PropTypes.func.isRequired,
  selectedResp: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};


export default ResponsibilitiesList;
