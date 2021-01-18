import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { ListGroup, ListGroupItem } from 'reactstrap';
import colors from 'styles/colors';
import RealizersMissingIcon from 'components/RealizersMissingIcon';
import _ from 'lodash';

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

const NeedsListGroupItem = styled(ListGroupItem)`
  display: flex;
  justify-content: space-between;
  &:focus {
    outline: none;
  }
  &.active {
    background-color: white;
    border-color: ${colors.need};
    color: ${colors.need};
  }
`;

const RightMarginSpan = styled.span`
  margin-right: 10px;
`;

const renderMissingRealizersAmount = (need) => {
  let realizersMissing = [];
  if (need.fulfilledBy) {
    realizersMissing = need.fulfilledBy.filter((resp) => !resp.realizer);
  }

  if (realizersMissing.length > 0) {
    return (
      <div>
        <RightMarginSpan>
          {realizersMissing.length}
          x
        </RightMarginSpan>
        {' '}
        <RealizersMissingIcon />
      </div>
    );
  }
  return '';
};

const NeedsList = ({ selectedNeedId, needs, subscribeToNeedsEvents }) => {
  const history = useHistory();
  const { orgSlug } = useParams();

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
            {renderMissingRealizersAmount(need)}
          </NeedsListGroupHeader>
        </SelectedNeedGroup>
      ))}
      <NeedsListGroup>
        {sortedNeeds.map((need) => (
          <NeedsListGroupItem
            key={need.nodeId}
            tag="button"
            href="#"
            action
            active={need.nodeId === selectedNeedId}
            onClick={() => history.push(`/${orgSlug}/${need.nodeId}`)}
          >
            {need.title}
            {renderMissingRealizersAmount(need)}
          </NeedsListGroupItem>
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
