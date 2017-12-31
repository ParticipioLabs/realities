import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup } from 'reactstrap';
import {
  CircleButton,
  NeedsListHeader,
  NeedsListGroupItem,
  RealitiesCircleOutline } from '@/styles/realities-styles';

const renderListItems = (needs, onSelectNeed, selectedNeed) => {
  if (needs) {
    return needs.map((need) => {
      const selected = need === selectedNeed;
      return (
        <NeedsListGroupItem
          key={need.nodeId}
          tag="button"
          href="#"
          action
          active={selected}
          onClick={() => onSelectNeed(need)}
        >
          {need.title}
        </NeedsListGroupItem>
      );
    });
  }

  return null;
};

const NeedsList = ({
  needs, onSelectNeed, selectedNeed, createNewNeed,
}) => (
  <div>
    <NeedsListHeader><span>Needs</span>
      <CircleButton onClick={() => createNewNeed()}>
        <RealitiesCircleOutline />
      </CircleButton>
    </NeedsListHeader>
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
