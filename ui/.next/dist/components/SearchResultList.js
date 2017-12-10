'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _SearchResultItem = require('./SearchResultItem');

var _SearchResultItem2 = _interopRequireDefault(_SearchResultItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = '/Users/belal/Desktop/webdev/Realities/realities/ui/components/SearchResultList.js';

// import PropTypes from 'prop-types';

var SearchResultList = function SearchResultList(props) {
  return _react2.default.createElement('div', { className: 'list-group', __source: {
      fileName: _jsxFileName,
      lineNumber: 6
    }
  }, _react2.default.createElement('ul', {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 7
    }
  }, props.searchResults.map(function (item) {
    return _react2.default.createElement(_SearchResultItem2.default, {
      active: item.isActive,
      title: item.title,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 9
      }
    });
  }), ';'));
};

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

exports.default = SearchResultList;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvU2VhcmNoUmVzdWx0TGlzdC5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIlNlYXJjaFJlc3VsdEl0ZW0iLCJTZWFyY2hSZXN1bHRMaXN0IiwicHJvcHMiLCJzZWFyY2hSZXN1bHRzIiwibWFwIiwiaXRlbSIsImlzQWN0aXZlIiwidGl0bGUiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLEFBQU87Ozs7QUFDUCxBQUFPLEFBQXNCOzs7Ozs7OztBQUM3Qjs7QUFFQSxJQUFNLG1CQUFtQixTQUFuQixBQUFtQix3QkFBQTt5QkFDdkIsY0FBQSxTQUFLLFdBQUwsQUFBZTtnQkFBZjtrQkFBQSxBQUNFO0FBREY7R0FBQSxrQkFDRSxjQUFBOztnQkFBQTtrQkFBQSxBQUNHO0FBREg7QUFBQSxXQUNHLEFBQU0sY0FBTixBQUFvQixJQUFJLGdCQUFBOzJCQUN2QixBQUFDO2NBQ1MsS0FEVixBQUNlLEFBQ2I7YUFBTyxLQUZULEFBRWM7O2tCQUZkO29CQUR1QixBQUN2QjtBQUFBO0FBQ0UsS0FERjtBQUZKLEFBQ0csTUFIa0IsQUFDdkIsQUFDRTtBQUZKOztBQWFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxBQUVBOztrQkFBQSxBQUFlIiwiZmlsZSI6IlNlYXJjaFJlc3VsdExpc3QuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2JlbGFsL0Rlc2t0b3Avd2ViZGV2L1JlYWxpdGllcy9yZWFsaXRpZXMvdWkifQ==