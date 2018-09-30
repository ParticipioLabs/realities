import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { ListGroup, ListGroupItem } from 'reactstrap';

const NeedsListGroup = styled(ListGroup)`
  margin-bottom: 1rem;
`;

const NeedsListGroupItem = styled(ListGroupItem)`
  &:focus {
    outline: none;
  }
  &.active {
    background-color: #00cf19;
    border-color: #00cf19;
    color: white;
  }
`;

const NeedsList = withRouter(({
  needs,
  selectedNeedId,
  history,
}) => (
  <div>
    <NeedsListGroup>
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
    </NeedsListGroup>
  </div>
));

NeedsList.propTypes = {
  needs: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  selectedNeedId: PropTypes.string,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

NeedsList.defaultProps = {
  needs: [],
  selectedNeedId: undefined,
  history: {
    push: () => null,
  },
};

export default NeedsList;
