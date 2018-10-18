import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Badge } from 'reactstrap';
import styled from 'styled-components';
import colors from '@/styles/colors';

const RealitiesBadge = styled(Badge)`
  margin-right: .5em;
  background-color: ${props => props.badgecolor};
`;

const Dependencies = ({ dependencies }) => (
  <ListGroup>
    {dependencies.map(({
      node: {
        __typename,
        nodeId,
        title,
      },
      onClick,
    }) => (
      <ListGroupItem
        key={nodeId}
        tag="button"
        href="#"
        action
        onClick={onClick}
      >
        <RealitiesBadge badgecolor={__typename === 'Need' ? colors.need : colors.responsibility}>
          {__typename[0]}
        </RealitiesBadge>
        {title}
      </ListGroupItem>
    ))}
  </ListGroup>
);

Dependencies.propTypes = {
  dependencies: PropTypes.arrayOf(PropTypes.shape({
    node: PropTypes.shape({
      __typename: PropTypes.string,
      nodeId: PropTypes.string,
      title: PropTypes.string,
    }),
    onClick: PropTypes.func,
  })),
};

Dependencies.defaultProps = {
  dependencies: [],
};

export default Dependencies;
