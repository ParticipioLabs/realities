import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ListGroupItem, Collapse } from 'reactstrap';
import { useHistory, useParams } from 'react-router-dom';
import colors from 'styles/colors';
import ResponsibilitiesContainer from './components/ResponsibilitiesContainer';
import MissingRealizersAmount from '../MissingRealizersAmount';

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

const NeedsListItem = ({ need, isSelected }) => {
  const history = useHistory();
  const { orgSlug } = useParams();

  return (
    <>
      <NeedsListGroupItem
        key={need.nodeId}
        tag="button"
        href="#"
        action
        active={isSelected}
        onClick={() => history.push(`/${orgSlug}/${need.nodeId}`)}
      >
        {need.title}
        <MissingRealizersAmount need={need} />
      </NeedsListGroupItem>
      <Collapse isOpen={isSelected}>
        <ResponsibilitiesContainer />
      </Collapse>
    </>
  );
};

NeedsListItem.propTypes = {
  need: PropTypes.shape({
    nodeId: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  isSelected: PropTypes.bool,
};

NeedsListItem.defaultProps = {
  isSelected: false,
};

export default NeedsListItem;
