import React from 'react';
import PropTypes from 'prop-types';
import withAuth from '@/components/withAuth';
import { withRouter } from 'react-router-dom';
import {
  CircleButton,
  NeedsListHeader,
  NeedsListGroupItem,
  RealitiesCircleOutline,
  RealitiesListGroup,
} from '@/styles/realities-styles';

const NeedsList = withRouter(withAuth(({
  needs,
  selectedNeedId,
  history,
  auth,
}) => (
  <div>
    <NeedsListHeader>
      <span>Needs</span>
      { auth.isLoggedIn &&
        <CircleButton onClick={() => null}>
          <RealitiesCircleOutline />
        </CircleButton>
      }
    </NeedsListHeader>
    <RealitiesListGroup>
      {needs.map(need => (
        <NeedsListGroupItem
          key={need.nodeId}
          tag="button"
          href="#"
          action
          active={need.nodeId === selectedNeedId}
          onClick={() => history.push(`/${need.nodeId}`)}
        >
          {need.title}
        </NeedsListGroupItem>
      ))}
    </RealitiesListGroup>
  </div>
)));

NeedsList.propTypes = {
  needs: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  selectedNeedId: PropTypes.string,
  auth: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
  }),
};

NeedsList.defaultProps = {
  needs: [],
  selectedNeedId: undefined,
  auth: {
    isLoggedIn: false,
  },
};

export default NeedsList;
