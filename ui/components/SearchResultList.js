import React from 'react';
import SearchResultItem from './SearchResultItem';
// import PropTypes from 'prop-types';

const SearchResultList = props => (
  <div>
    <ul>
      {props.searchResults.map(item => (
        <li>
          <SearchResultItem title={item.title} description={item.description} />
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

export default { SearchResultList };
