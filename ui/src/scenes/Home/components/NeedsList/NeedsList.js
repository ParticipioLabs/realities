import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Card } from 'reactstrap';
import styled from 'styled-components';
import MdAddCircleOutline from 'react-icons/lib/md/add-circle-outline';

// const ListDiv = styled.div`
//   .list-heading {
//     color: green;
//   }
//   .list-area {
//     border: 1px solid red;
//   }
// `;
//
// const List = styled(ListGroup)`
//   color: red;
// `;

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
`;

const RealitiesListHeader = styled(Card)`
      font-size: 1.5em;
      padding: 0.5em 0.5em 0.5em 0.5em;
      flex-direction: row;
      justify-content: space-between;
      color: #fff;
      background-color: #00cf19;
      margin-bottom: 0.5em;
`;

const RealitiesListGroupItem = styled(ListGroupItem)`
    &.active {
      background-color: #00cf19;
      border-color: #00cf19;
      color: #fff;
    }
`;

const renderListItems = (needs, onSelectNeed, selectedNeed) => {
  if (needs) {
    return needs.map((need) => {
      const selected = need === selectedNeed;
      return (
        <RealitiesListGroupItem
          key={need.nodeId}
          tag="a"
          href="#"
          action
          active={selected}
          onClick={() => onSelectNeed(need)}
        >
          {need.title}
        </RealitiesListGroupItem>
      );
    });
  }
  return null;
};

const NeedsList = ({
  needs, onSelectNeed, selectedNeed, createNewNeed,
}) => (
  <div>
    <RealitiesListHeader><span>Needs</span>
      <a href="#" onClick={() => createNewNeed()}>
        <RealitiesCircleOutline />
      </a>
    </RealitiesListHeader>
    <ListGroup>
      {renderListItems(needs, onSelectNeed, selectedNeed)}
    </ListGroup>
  </div>
);

NeedsList.defaultProps = {
  needs: [],
  selectedNeed: {},
};

NeedsList.propTypes = {
  needs: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  onSelectNeed: PropTypes.func.isRequired,
  createNewNeed: PropTypes.func.isRequired,
  selectedNeed: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default NeedsList;
