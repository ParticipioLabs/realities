import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem } from 'reactstrap';
import TypeBadge from '@/components/TypeBadge';

const SearchResults = ({
  results,
  getMenuProps,
  getItemProps,
  highlightedIndex,
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
        <TypeBadge nodeType={item.__typename} />
        {item.title}
      </ListGroupItem>
    ))}
  </ListGroup>
);

SearchResults.propTypes = {
  results: PropTypes.arrayOf(PropTypes.shape({
    __typename: PropTypes.string,
    nodeId: PropTypes.string,
    title: PropTypes.string,
    fulfills: PropTypes.shape({
      nodeId: PropTypes.string,
    }),
  })),
  getMenuProps: PropTypes.func,
  getItemProps: PropTypes.func,
  highlightedIndex: PropTypes.number,
};

SearchResults.defaultProps = {
  results: [],
  getMenuProps: () => {},
  getItemProps: () => {},
  highlightedIndex: null,
};

export default SearchResults;
