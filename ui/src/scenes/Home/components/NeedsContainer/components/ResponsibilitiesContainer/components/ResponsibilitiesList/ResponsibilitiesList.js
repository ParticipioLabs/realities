import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import withAuth from '@/components/withAuth';
import {
  CircleButton,
  ResponsibilitiesListHeader,
  ResponsibilitiesListGroupItem,
  RealitiesCircleOutline,
  RealitiesListGroup } from '@/styles/realities-styles';

const ResponsibilitiesList = withRouter(withAuth(({
  responsibilities,
  selectedResponsibilityId,
  history,
  match,
  auth,
}) => (
  <div>
    <ResponsibilitiesListHeader>
      <span>Responsibilities</span>
      { auth.isLoggedIn &&
        <CircleButton onClick={() => null}>
          <RealitiesCircleOutline />
        </CircleButton>
      }
    </ResponsibilitiesListHeader>
    <RealitiesListGroup>
      {responsibilities.map(responsibility => (
        <ResponsibilitiesListGroupItem
          key={responsibility.nodeId}
          tag="button"
          href="#"
          action
          active={responsibility.nodeId === selectedResponsibilityId}
          onClick={() => history.push(`/${match.params.needId}/${responsibility.nodeId}`)}
        >
          {responsibility.title}
        </ResponsibilitiesListGroupItem>
      ))}
    </RealitiesListGroup>
  </div>
)));

ResponsibilitiesList.propTypes = {
  responsibilities: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  selectedResponsibilityId: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      needId: PropTypes.string,
    }),
  }),
  auth: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
  }),
};

ResponsibilitiesList.defaultProps = {
  responsibilities: [],
  selectedResponsibilityId: undefined,
  history: {
    push: () => null,
  },
  match: {
    params: {
      needId: undefined,
    },
  },
  auth: {
    isLoggedIn: false,
  },
};

export default ResponsibilitiesList;
