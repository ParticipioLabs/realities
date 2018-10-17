import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem } from 'reactstrap';

const TypeaheadResults = ({
  results,
  getMenuProps,
  getItemProps,
  highlightedIndex,
  itemToString,
}) => (
  <ListGroup flush {...getMenuProps()}>
    {results.map((item, index) => (
      <ListGroupItem
        {...getItemProps({
          key: item.nodeId,
          item,
          style: { backgroundColor: highlightedIndex === index ? '#f8f9fa' : 'white' },
        })}
      >
        {itemToString(item)}
      </ListGroupItem>
    ))}
  </ListGroup>
);

TypeaheadResults.propTypes = {
  results: PropTypes.arrayOf(PropTypes.shape({
    nodeId: PropTypes.string,
  })),
  getMenuProps: PropTypes.func,
  getItemProps: PropTypes.func,
  highlightedIndex: PropTypes.number,
  itemToString: PropTypes.func,
};

TypeaheadResults.defaultProps = {
  results: [],
  getMenuProps: () => {},
  getItemProps: () => {},
  highlightedIndex: null,
  itemToString: () => '',
};

export default TypeaheadResults;
