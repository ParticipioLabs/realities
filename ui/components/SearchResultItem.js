import React from 'react';
import PropTypes from 'prop-types';

const SearchResultItem = props => (
  <div>
    <p>SearchResultItem</p>
    <p>{props.title}</p>
    <p>{props.description}</p>
  </div>
);

SearchResultItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
//   realityGuide: PropTypes.object.isRequired,
//   delete: PropTypes.func.isRequired,
//   realiser: PropTypes.object,
//   link: PropTypes.string,
//   dependencyList: PropTypes.array,
//   responsibilities: PropTypes.array,
//   status: PropTypes.oneOf(['red', 'yellow', 'green']),
};

export default { SearchResultItem };
