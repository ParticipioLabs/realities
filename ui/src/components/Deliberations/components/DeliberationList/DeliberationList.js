import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ListGroup, ListGroupItem } from 'reactstrap';
import TypeBadge from '@/components/TypeBadge';
import RemoveDeliberation from './components/RemoveDeliberation';

const StyledListGroupItem = styled(ListGroupItem)`
  position: relative;
  ${props => props.showremove && 'padding-right: 6em;'}
`;

const RemoveWrapper = styled.span`
  position: absolute;
  top: 0.54em;
  right: 0.54em;
`;

const Deliberations = ({ deliberations, showRemove }) => (
  <ListGroup>
    {deliberations.map(({
      node: {
        __typename,
        nodeId,
        title,
        url,
      },
      onClick,
    }) => (
      <StyledListGroupItem
        key={nodeId}
        tag="div"
        href="#"
        action
        onClick={onClick}
        showremove={showRemove ? 'true' : '' /* styled component doesn't want a boolean */}
      >
        <TypeBadge nodeType={__typename} />
        {title}
        {showRemove && (
          <RemoveWrapper>
            <RemoveDeliberation nodeType={__typename} nodeId={nodeId} />
          </RemoveWrapper>
        )}
      </StyledListGroupItem>
    ))}
  </ListGroup>
);

Deliberations.propTypes = {
  deliberations: PropTypes.arrayOf(PropTypes.shape({
    node: PropTypes.shape({
      __typename: PropTypes.string,
      nodeId: PropTypes.string,
      title: PropTypes.string,
    }),
    onClick: PropTypes.func,
  })),
  showRemove: PropTypes.bool,
};

Deliberations.defaultProps = {
  deliberations: [],
  showRemove: false,
};

export default Deliberations;
