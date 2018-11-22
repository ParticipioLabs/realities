import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
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

const RightMarginSpan = styled.span`
  margin-right: 10px;
`;

const renderMissingRealizersAmount = (need) => {
  let realizersMissing = [];
  if (need.fulfilledBy) {
    realizersMissing = need.fulfilledBy.filter(resp => !resp.realizer);
  }

  if (realizersMissing.length > 0) {
    return (
      <div>
        <RightMarginSpan>{realizersMissing.length}x</RightMarginSpan> <RedDot />
      </div>
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
  need: PropTypes.arrayOf(PropTypes.shape({
    nodeId: PropTypes.string,
    title: PropTypes.string,
    realizer: PropTypes.shape({
      nodeId: PropTypes.string,
      name: PropTypes.string,
    }),
  })),
};

NeedsList.defaultProps = {
  needs: [],
  selectedNeedId: undefined,
  history: {
    push: () => null,
  },
  need: [],
};

export default NeedsList;
