import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ListGroup } from 'reactstrap';
import _ from 'lodash';
import NeedsListItem from './components/NeedsListItem';

const NeedsListGroup = styled(ListGroup)`
  margin-bottom: 1rem;
`;

const NeedsList = ({ selectedNeedId, needs, subscribeToNeedsEvents }) => {
  useEffect(() => subscribeToNeedsEvents(), [subscribeToNeedsEvents]);

  const sortedNeeds = _.orderBy(needs, [(r) => {
    if (r.title) return r.title.toLowerCase();
    return '';
  }], ['asc']);
  return (
    <NeedsListGroup>
      {sortedNeeds.map((need) => (
        <NeedsListItem
          key={need.nodeId}
          need={need}
          isSelected={need.nodeId === selectedNeedId}
        />
      ))}
    </NeedsListGroup>
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
