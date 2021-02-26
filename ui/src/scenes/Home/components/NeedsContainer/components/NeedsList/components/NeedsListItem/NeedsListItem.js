import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ListGroupItem, Collapse } from 'reactstrap';
import { useHistory, useParams } from 'react-router-dom';
import colors from 'styles/colors';
import useAuth from 'services/useAuth';
import ResponsibilitiesContainer from './components/ResponsibilitiesContainer';
import MissingRealitiesOnNeed from './components/MissingRealitiesOnNeed';

const NeedsListGroupItem = styled(ListGroupItem)`
  display: flex;
  justify-content: space-between;
  &:focus {
    outline: none;
  }
  &.active {
    background-color: ${({ filledin }) => (filledin ? colors.need : 'white')};
    border-color: ${colors.need};
    color: ${({ filledin }) => (filledin ? 'white' : colors.need)};
  }
`;

const NoRespsContainer = styled.div`
  margin: 0 1rem;
`;

const SimpleLink = styled.span`
  color: blue;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const NeedsListItem = ({
  need, isHighlighted, isSelected, selectThisNeed,
}) => {
  const history = useHistory();
  const params = useParams();
  const { isLoggedIn } = useAuth();

  return (
    <>
      <NeedsListGroupItem
        tag="button"
        href="#"
        action
        filledin={params.needId === need.nodeId ? 'true' : ''}
        active={isHighlighted || params.needId === need.nodeId}
        onClick={selectThisNeed}
      >
        {need.title}
        <MissingRealitiesOnNeed need={need} />
      </NeedsListGroupItem>
      <Collapse isOpen={isSelected}>
        {need.fulfilledBy.length === 0
          && (
            <NoRespsContainer>
              This Need doesn&apos;t contain any Responsibilities yet.
              {' '}
              {isLoggedIn ? 'Click above to add one, or' : ''}
              {' '}
              <SimpleLink
                onClick={() => history.push(`/${params.orgSlug}/need/${need.nodeId}`)}
              >
                {/* TODO: would want to put this button on the bar for the need but
                  that wasn't working properly with bootstrap. maybe do it
                  when we're switching to another style */}
                {isLoggedIn ? 'click here' : 'Click here'}
              </SimpleLink>
              {' '}
              to view the Need directly.
            </NoRespsContainer>
          )}
        <ResponsibilitiesContainer needId={need.nodeId} />
      </Collapse>
    </>
  );
};

NeedsListItem.propTypes = {
  need: PropTypes.shape({
    nodeId: PropTypes.string,
    title: PropTypes.string,
    fulfilledBy: PropTypes.arrayOf(
      PropTypes.shape({
        nodeId: PropTypes.string,
      }),
    ),
  }).isRequired,
  isHighlighted: PropTypes.bool,
  isSelected: PropTypes.bool,
  selectThisNeed: PropTypes.func,
};

NeedsListItem.defaultProps = {
  isHighlighted: false,
  isSelected: false,
  selectThisNeed: () => null,
};

export default NeedsListItem;
