import React from 'react';
import styled from 'styled-components';
import RealizersMissingIcon from 'components/RealizersMissingIcon';

const RightMarginSpan = styled.span`
  margin-right: 10px;
`;

const MissingRealitiesOnNeed = ({ need }) => {
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

export default MissingRealitiesOnNeed;
