import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem } from 'reactstrap';
import TypeBadge from '@/components/TypeBadge';

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
        <TypeBadge nodeType={__typename} />
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
