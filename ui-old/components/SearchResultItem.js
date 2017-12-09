import React from 'react';
// import PropTypes from 'prop-types';

const SearchResultItem = props => (
  <a
    href="http://google.com"
    className={`list-group-item list-group-item-action ${props.isActive && 'active'}`}
  >
    {props.title}
  </a>
);

// SearchResultItem.propTypes = {
//   title: PropTypes.string.isRequired,
  // description: PropTypes.string.isRequired,
//   realityGuide: PropTypes.object.isRequired,
//   delete: PropTypes.func.isRequired,
//   realiser: PropTypes.object,
//   link: PropTypes.string,
//   dependencyList: PropTypes.array,
//   responsibilities: PropTypes.array,
//   status: PropTypes.oneOf(['red', 'yellow', 'green']),
// };

export default SearchResultItem;
