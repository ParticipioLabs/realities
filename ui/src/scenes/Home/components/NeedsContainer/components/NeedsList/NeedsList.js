import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ListGroup, ListGroupItem } from 'reactstrap';
import _ from 'lodash';
import colors from 'styles/colors';
import MissingRealizersAmount from './components/MissingRealizersAmount';
import NeedsListItem from './components/NeedsListItem';

const NeedsListGroup = styled(ListGroup)`
  margin-bottom: 1rem;
`;

const SelectedNeedGroup = styled(ListGroup)`
  margin-bottom: 0.5rem;
`;

const NeedsListGroupHeader = styled(ListGroupItem)`
  display: flex;
  justify-content: space-between;
  &:focus {
    outline: none;
  }
  &.active {
    background-color: ${colors.need};
    border-color: ${colors.need};
    color: white;
  }
`;

const NeedsList = ({ selectedNeedId, needs, subscribeToNeedsEvents }) => {
  useEffect(() => subscribeToNeedsEvents(), [subscribeToNeedsEvents]);

  const sortedNeeds = _.orderBy(needs, [(r) => {
    if (r.title) return r.title.toLowerCase();
    return '';
  }], ['asc']);
  return (
    <div>
      {sortedNeeds.filter((need) => need.nodeId === selectedNeedId).map((need) => (
        <SelectedNeedGroup key={1}>
          <NeedsListGroupHeader
            active
          >
            {need.title}
            <MissingRealizersAmount need={need} />
          </NeedsListGroupHeader>
        </SelectedNeedGroup>
      ))}
      <NeedsListGroup>
        {sortedNeeds.map((need) => (
          <NeedsListItem
            key={need.nodeId}
            need={need}
            isSelected={need.nodeId === selectedNeedId}
          />
        ))}
      </NeedsListGroup>
    </div>
  );
};

NeedsList.propTypes = {
  subscribeToNeedsEvents: PropTypes.func.isRequired,
  needs: PropTypes.arrayOf(PropTypes.shape({
    nodeId: PropTypes.string,
    title: PropTypes.string,
  })),
  selectedNeedId: PropTypes.string,
};

NeedsList.defaultProps = {
  needs: [],
  selectedNeedId: undefined,
};

export default NeedsList;
