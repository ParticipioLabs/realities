import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { ListGroup, ListGroupItem } from 'reactstrap';
import colors from '@/styles/colors';
import { RedDot } from '@/components/styledElements';

const NeedsListGroup = styled(ListGroup)`
  margin-bottom: 1rem;
`;

const NeedsListGroupItem = styled(ListGroupItem)`
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

const FlexDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

const RightMarginSpan = styled.span`
  margin-right: 10px;
`;

const renderMissingRealizersAmount = (need) => {
  let count = 0;
  need.fulfilledBy.forEach((responsibility) => {
    if (!responsibility.realizer) count += 1;
  });

  if (count > 0) {
    return (
      <FlexDiv>
        <RightMarginSpan>{count}x</RightMarginSpan> <RedDot />
      </FlexDiv>
    );
  }
  return '';
};

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
          {renderMissingRealizersAmount(need)}
        </NeedsListGroupItem>
      ))}
    </NeedsListGroup>
  </div>
));

NeedsList.propTypes = {
  needs: PropTypes.arrayOf(PropTypes.shape({
    nodeId: PropTypes.string,
    title: PropTypes.string,
  })),
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
