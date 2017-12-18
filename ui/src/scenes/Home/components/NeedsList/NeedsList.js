import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Card } from 'reactstrap';
import styled from 'styled-components';

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

const RealitiesListHeader = styled(Card)`
      font-size: 1.5em;
      padding: .5em 0 .5em 0;
      text-align:center;
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
    return needs.map((need, i) => {
      const selected = need === selectedNeed;
      return (
        <RealitiesListGroupItem
          key={i}
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

const NeedsList = ({ needs, onSelectNeed, selectedNeed }) => (
  <div>
    <RealitiesListHeader>Needs</RealitiesListHeader>
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
  selectedNeed: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default NeedsList;
