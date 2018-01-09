import React from 'react';
import PropTypes from 'prop-types';
import withAuth from '@/components/withAuth';
import {
  CircleButton,
  NeedsListHeader,
  NeedsListGroupItem,
  RealitiesCircleOutline,
  RealitiesListGroup } from '@/styles/realities-styles';

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
  needs, onSelectNeed, selectedNeed, toggleCreateNewNeed, auth,
}) => (
  <div>
    <NeedsListHeader><span>Needs</span>
      { true &&
      <CircleButton onClick={() => toggleCreateNewNeed()}>
        <RealitiesCircleOutline />
      </CircleButton>
      }
    </NeedsListHeader>
    <RealitiesListGroup>
      {renderListItems(needs, onSelectNeed, selectedNeed)}
    </RealitiesListGroup>
  </div>
);

NeedsList.defaultProps = {
  needs: [],
  selectedNeed: {},
  auth: {
    email: 'example@example.com',
    login: () => null,
    logout: () => null,
    isLoggedIn: false,
  },
};

NeedsList.propTypes = {
  needs: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  onSelectNeed: PropTypes.func.isRequired,
  toggleCreateNewNeed: PropTypes.func.isRequired,
  selectedNeed: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  auth: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
    email: PropTypes.string,
    login: PropTypes.func,
    logout: PropTypes.func,
  }),
};

export default withAuth(NeedsList);
