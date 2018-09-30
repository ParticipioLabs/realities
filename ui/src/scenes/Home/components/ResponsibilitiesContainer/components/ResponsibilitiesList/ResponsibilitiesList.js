import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { ListGroup, ListGroupItem } from 'reactstrap';

const ResponsibilitiesListGroup = styled(ListGroup)`
  margin-bottom: 1rem;
`;

const ResponsibilitiesListGroupItem = styled(ListGroupItem)`
  &:focus {
    outline: none;
  }
  &.active {
    background-color: #843cfd;
    border-color: #843cfd;
    color: white;
  }
`;

const ResponsibilitiesList = withRouter(({
  responsibilities,
  selectedResponsibilityId,
  history,
  match,
}) => (
  <div>
    <ResponsibilitiesListGroup>
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
    </ResponsibilitiesListGroup>
  </div>
));

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
};

export default ResponsibilitiesList;
