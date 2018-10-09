import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ListGroup, ListGroupItem, Badge } from 'reactstrap';
import colors from '@/styles/colors';

const RealitiesBadge = styled(Badge)`
  background-color: ${props => props.badgecolor};
  margin-right: .5em;
`;

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
        <RealitiesBadge
          badgecolor={item.__typename === 'Need' ? colors.need : colors.responsibility}
        >
          {item.__typename[0]}
        </RealitiesBadge>
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
