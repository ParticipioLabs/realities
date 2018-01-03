import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup } from 'reactstrap';
import withAuth from '@/components/withAuth';
import {
  CircleButton,
  ResponsibilitiesListHeader,
  ResponsibilitiesListGroupItem,
  RealitiesCircleOutline } from '@/styles/realities-styles';

const renderListItems = (responsibilities, onSelectResponsibility, selectedResp) => {
  if (responsibilities) {
    return responsibilities.map((responsibility) => {
      const selected = responsibility === selectedResp;
      return (
        <ResponsibilitiesListGroupItem
          key={responsibility.nodeId}
          tag="button"
          href="#"
          action
          active={selected}
          onClick={() => onSelectResponsibility(responsibility)}
        >
          {responsibility.title}
        </ResponsibilitiesListGroupItem>
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

const ResponsibilitiesList = ({
  responsibilities, onSelectResponsibility, selectedResp, createNewResponsibility, auth,
}) => (
  <div>
    <ResponsibilitiesListHeader><span>Responsibilities</span>
      { auth.isLoggedIn && responsibilities &&
      <CircleButton
        onClick={() => createNewResponsibility()}
      >
        <RealitiesCircleOutline />
      </CircleButton>
      }
    </ResponsibilitiesListHeader>
    <ListGroup>
      {renderListItems(responsibilities, onSelectResponsibility, selectedResp)}
    </ListGroup>
  </div>
);

ResponsibilitiesList.defaultProps = {
  responsibilities: [],
  selectedResp: {},
  auth: {
    email: 'example@example.com',
    login: () => null,
    logout: () => null,
    isLoggedIn: false,
  },
};

ResponsibilitiesList.propTypes = {
  responsibilities: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  onSelectResponsibility: PropTypes.func.isRequired,
  createNewResponsibility: PropTypes.func.isRequired,
  selectedResp: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  auth: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
    email: PropTypes.string,
    login: PropTypes.func,
    logout: PropTypes.func,
  }),
};

export default withAuth(ResponsibilitiesList);
