import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ListGroupItem, Collapse } from 'reactstrap';
import { useHistory, useParams } from 'react-router-dom';
import colors from 'styles/colors';
import ResponsibilitiesContainer from './components/ResponsibilitiesContainer';
import MissingRealitiesOnNeed from './components/MissingRealitiesOnNeed';

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

const NeedsListItem = ({ need, isSelected, selectThisNeed }) => {
  const history = useHistory();
  const { orgSlug } = useParams();

  return (
    <>
      <NeedsListGroupItem
        tag="button"
        href="#"
        action
        active={isSelected}
        onClick={selectThisNeed}
      >
        {need.title}
        <MissingRealitiesOnNeed need={need} />
      </NeedsListGroupItem>
      <Collapse isOpen={isSelected}>
        {need.fulfilledBy.length === 0
          && (
            <NoRespsContainer>
              This Need doesn&apos;t contain any Responsibilities yet. Click above to add one, or
              {' '}
              <SimpleLink
                onClick={() => history.push(`/${orgSlug}/need/${need.nodeId}`)}
              >
                click here
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
  isSelected: PropTypes.bool,
  selectThisNeed: PropTypes.func,
};

NeedsListItem.defaultProps = {
  isSelected: false,
  selectThisNeed: () => null,
};

export default NeedsListItem;
