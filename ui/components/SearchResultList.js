import React from 'react';
// import PropTypes from 'prop-types';

const SearchResultItem = props => (
  <div>
    <ul>
      {props.searchResults.map(item => (
        <li>
          {item.title}
        </li>
        ))}
    </ul>
  </div>
);

// SearchResultItem.propTypes = {
//   title: PropTypes.string.isRequired,
//   description: PropTypes.string.isRequired,
//   searchResults: PropTypes.string
//   realityGuide: PropTypes.object.isRequired,
//   delete: PropTypes.func.isRequired,
//   realiser: PropTypes.object,
//   link: PropTypes.string,
//   dependencyList: PropTypes.array,
//   responsibilities: PropTypes.array,
//   status: PropTypes.oneOf(['red', 'yellow', 'green']),
// };

export default { SearchResultItem };
