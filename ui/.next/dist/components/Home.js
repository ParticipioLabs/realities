'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('bootstrap/dist/css/bootstrap.css');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactstrap = require('reactstrap');

var _SearchResultList = require('./SearchResultList');

var _SearchResultList2 = _interopRequireDefault(_SearchResultList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = '/Users/belal/Desktop/webdev/Realities/realities/ui/components/Home.js';
// import PropTypes from 'prop-types';
// import SearchField from '../components/SearchField';


// const results = [{
//   id: 'need1',
//   title: 'Fire Safety',
//   dependsOn: ['need2'],
// }, {
//   id: 'need2',
//   title: 'Safe Burn Environment',
//   dependsOn: [],
// }, {
//   id: 'need3',
//   title: 'Water',
//   dependsOn: [],
// }];

function Home() {
  // console.log(data);
  return _react2.default.createElement('div', { className: 'container', __source: {
      fileName: _jsxFileName,
      lineNumber: 26
    }
  }, _react2.default.createElement('div', { className: 'row', __source: {
      fileName: _jsxFileName,
      lineNumber: 27
    }
  }, _react2.default.createElement('div', { id: '', className: 'col-xs-12 col-lg-6', __source: {
      fileName: _jsxFileName,
      lineNumber: 28
    }
  }, _react2.default.createElement(_reactstrap.Form, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 29
    }
  }, _react2.default.createElement(_reactstrap.FormGroup, {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 30
    }
  }, _react2.default.createElement(_reactstrap.Input, {
    type: 'text',
    className: 'form-control-lg',
    id: 'searchInput',
    'aria-describedby': 'searchInput',
    placeholder: 'Enter search term',
    __source: {
      fileName: _jsxFileName,
      lineNumber: 31
    }
  }))), _react2.default.createElement('div', { className: 'row', __source: {
      fileName: _jsxFileName,
      lineNumber: 40
    }
  }, _react2.default.createElement('div', { id: 'needs', className: 'col-xs-12 col-lg-6', __source: {
      fileName: _jsxFileName,
      lineNumber: 41
    }
  }, _react2.default.createElement('h3', {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 42
    }
  }, 'Needs'), _react2.default.createElement(_SearchResultList2.default, { searchResults: [{ title: 'title1' }, { title: 'title2' }], __source: {
      fileName: _jsxFileName,
      lineNumber: 43
    }
  })), _react2.default.createElement('div', { id: 'responsibilities', className: 'col-xs-12 col-lg-6', __source: {
      fileName: _jsxFileName,
      lineNumber: 45
    }
  }, _react2.default.createElement('h3', {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46
    }
  }, 'Responsibilities'), _react2.default.createElement(_SearchResultList2.default, { searchResults: [{ title: 'title1' }, { title: 'title2' }], __source: {
      fileName: _jsxFileName,
      lineNumber: 47
    }
  })))), _react2.default.createElement('div', { id: '', className: 'col-xs-12 col-lg-6', __source: {
      fileName: _jsxFileName,
      lineNumber: 51
    }
  }, _react2.default.createElement('div', { className: 'row', __source: {
      fileName: _jsxFileName,
      lineNumber: 52
    }
  }, _react2.default.createElement('div', { id: 'description', className: 'col-xs-12', __source: {
      fileName: _jsxFileName,
      lineNumber: 53
    }
  }, _react2.default.createElement('div', { className: 'card', style: { width: '20rem' }, __source: {
      fileName: _jsxFileName,
      lineNumber: 54
    }
  }, _react2.default.createElement('div', { className: 'card-body', __source: {
      fileName: _jsxFileName,
      lineNumber: 55
    }
  }, _react2.default.createElement('h4', { className: 'card-title', __source: {
      fileName: _jsxFileName,
      lineNumber: 56
    }
  }, 'Description'), _react2.default.createElement('h6', { className: 'card-subtitle mb-2 text-muted', __source: {
      fileName: _jsxFileName,
      lineNumber: 57
    }
  }, 'Subtitle'), _react2.default.createElement('p', {
    className: 'card-text',
    __source: {
      fileName: _jsxFileName,
      lineNumber: 58
    }
  }, 'Some quick example text to build on the card title and make up the bulk of the cards content.'), _react2.default.createElement('a', { href: 'http://google.com', className: 'card-link', __source: {
      fileName: _jsxFileName,
      lineNumber: 63
    }
  }, 'Card link'), _react2.default.createElement('a', { href: 'http://google.com', className: 'card-link', __source: {
      fileName: _jsxFileName,
      lineNumber: 64
    }
  }, 'Another link')))), _react2.default.createElement('div', { id: 'graph', className: 'col-xs-12', __source: {
      fileName: _jsxFileName,
      lineNumber: 68
    }
  }, _react2.default.createElement('div', { className: 'card', style: { width: '20rem' }, __source: {
      fileName: _jsxFileName,
      lineNumber: 69
    }
  }, _react2.default.createElement('div', { className: 'card-body', __source: {
      fileName: _jsxFileName,
      lineNumber: 70
    }
  }, _react2.default.createElement('h4', { className: 'card-title', __source: {
      fileName: _jsxFileName,
      lineNumber: 71
    }
  }, 'Graph'), _react2.default.createElement('h6', { className: 'card-subtitle mb-2 text-muted', __source: {
      fileName: _jsxFileName,
      lineNumber: 72
    }
  }, 'Subtitle'), _react2.default.createElement('p', {
    className: 'card-text',
    __source: {
      fileName: _jsxFileName,
      lineNumber: 73
    }
  }, 'Some quick example text to build on the card title and make up the bulk of the cards content.'), _react2.default.createElement('a', { href: 'http://google.com', className: 'card-link', __source: {
      fileName: _jsxFileName,
      lineNumber: 78
    }
  }, 'Card link'), _react2.default.createElement('a', { href: 'http://google.com', className: 'card-link', __source: {
      fileName: _jsxFileName,
      lineNumber: 79
    }
  }, 'Another link'))))))));
}

exports.default = Home;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvSG9tZS5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIkJ1dHRvbiIsIkZvcm0iLCJGb3JtR3JvdXAiLCJMYWJlbCIsIklucHV0IiwiRm9ybVRleHQiLCJDYXJkIiwiQ2FyZEltZyIsIkNhcmRUZXh0IiwiQ2FyZEJvZHkiLCJDYXJkVGl0bGUiLCJDYXJkU3VidGl0bGUiLCJTZWFyY2hSZXN1bHRMaXN0IiwiSG9tZSIsInRpdGxlIiwid2lkdGgiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUNBLEFBQU87Ozs7QUFDUCxBQUFTLEFBQVEsQUFBTSxBQUFXLEFBQU8sQUFBTyxBQUM5QyxBQUFNLEFBQVMsQUFBVSxBQUFVLEFBQVc7O0FBR2hELEFBQU8sQUFBc0I7Ozs7Ozs7QUFGN0I7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBQSxBQUFTLE9BQU8sQUFDZDtBQUNBO3lCQUNFLGNBQUEsU0FBSyxXQUFMLEFBQWU7Z0JBQWY7a0JBQUEsQUFDRTtBQURGO0dBQUEsa0JBQ0UsY0FBQSxTQUFLLFdBQUwsQUFBZTtnQkFBZjtrQkFBQSxBQUNFO0FBREY7cUJBQ0UsY0FBQSxTQUFLLElBQUwsQUFBUSxJQUFHLFdBQVgsQUFBcUI7Z0JBQXJCO2tCQUFBLEFBQ0U7QUFERjtxQkFDRSxBQUFDOztnQkFBRDtrQkFBQSxBQUNFO0FBREY7QUFBQSxxQkFDRSxBQUFDOztnQkFBRDtrQkFBQSxBQUNFO0FBREY7QUFBQSxxQkFDRSxBQUFDO1VBQUQsQUFDTyxBQUNMO2VBRkYsQUFFWSxBQUNWO1FBSEYsQUFHSyxBQUNIO3dCQUpGLEFBSW1CLEFBQ2pCO2lCQUxGLEFBS2M7O2dCQUxkO2tCQUhOLEFBQ0UsQUFDRSxBQUNFLEFBU0o7QUFUSTtBQUNFLHdCQVFOLGNBQUEsU0FBSyxXQUFMLEFBQWU7Z0JBQWY7a0JBQUEsQUFDRTtBQURGO3FCQUNFLGNBQUEsU0FBSyxJQUFMLEFBQVEsU0FBUSxXQUFoQixBQUEwQjtnQkFBMUI7a0JBQUEsQUFDRTtBQURGO3FCQUNFLGNBQUE7O2dCQUFBO2tCQUFBO0FBQUE7QUFBQSxLQURGLEFBQ0UsQUFDQSwwQkFBQSxBQUFDLDRDQUFpQixlQUFlLENBQUMsRUFBRSxPQUFILEFBQUMsQUFBUyxZQUFZLEVBQUUsT0FBekQsQUFBaUMsQUFBc0IsQUFBUztnQkFBaEU7a0JBSEosQUFDRSxBQUVFLEFBRUY7QUFGRTt1QkFFRixjQUFBLFNBQUssSUFBTCxBQUFRLG9CQUFtQixXQUEzQixBQUFxQztnQkFBckM7a0JBQUEsQUFDRTtBQURGO3FCQUNFLGNBQUE7O2dCQUFBO2tCQUFBO0FBQUE7QUFBQSxLQURGLEFBQ0UsQUFDQSxxQ0FBQSxBQUFDLDRDQUFpQixlQUFlLENBQUMsRUFBRSxPQUFILEFBQUMsQUFBUyxZQUFZLEVBQUUsT0FBekQsQUFBaUMsQUFBc0IsQUFBUztnQkFBaEU7a0JBcEJSLEFBQ0UsQUFZRSxBQUtFLEFBRUUsQUFJTjtBQUpNO3lCQUlOLGNBQUEsU0FBSyxJQUFMLEFBQVEsSUFBRyxXQUFYLEFBQXFCO2dCQUFyQjtrQkFBQSxBQUNFO0FBREY7cUJBQ0UsY0FBQSxTQUFLLFdBQUwsQUFBZTtnQkFBZjtrQkFBQSxBQUNFO0FBREY7cUJBQ0UsY0FBQSxTQUFLLElBQUwsQUFBUSxlQUFjLFdBQXRCLEFBQWdDO2dCQUFoQztrQkFBQSxBQUNFO0FBREY7cUJBQ0UsY0FBQSxTQUFLLFdBQUwsQUFBZSxRQUFPLE9BQU8sRUFBRSxPQUEvQixBQUE2QixBQUFTO2dCQUF0QztrQkFBQSxBQUNFO0FBREY7cUJBQ0UsY0FBQSxTQUFLLFdBQUwsQUFBZTtnQkFBZjtrQkFBQSxBQUNFO0FBREY7cUJBQ0UsY0FBQSxRQUFJLFdBQUosQUFBYztnQkFBZDtrQkFBQTtBQUFBO0tBREYsQUFDRSxBQUNBLGdDQUFBLGNBQUEsUUFBSSxXQUFKLEFBQWM7Z0JBQWQ7a0JBQUE7QUFBQTtLQUZGLEFBRUUsQUFDQSw2QkFBQSxjQUFBO2VBQUEsQUFDWTs7Z0JBRFo7a0JBQUE7QUFBQTtBQUNFLEtBSkosQUFHRSxBQUtBLGtIQUFBLGNBQUEsT0FBRyxNQUFILEFBQVEscUJBQW9CLFdBQTVCLEFBQXNDO2dCQUF0QztrQkFBQTtBQUFBO0tBUkYsQUFRRSxBQUNBLDhCQUFBLGNBQUEsT0FBRyxNQUFILEFBQVEscUJBQW9CLFdBQTVCLEFBQXNDO2dCQUF0QztrQkFBQTtBQUFBO0tBWlIsQUFDRSxBQUNFLEFBQ0UsQUFTRSxBQUlOLG9DQUFBLGNBQUEsU0FBSyxJQUFMLEFBQVEsU0FBUSxXQUFoQixBQUEwQjtnQkFBMUI7a0JBQUEsQUFDRTtBQURGO3FCQUNFLGNBQUEsU0FBSyxXQUFMLEFBQWUsUUFBTyxPQUFPLEVBQUUsT0FBL0IsQUFBNkIsQUFBUztnQkFBdEM7a0JBQUEsQUFDRTtBQURGO3FCQUNFLGNBQUEsU0FBSyxXQUFMLEFBQWU7Z0JBQWY7a0JBQUEsQUFDRTtBQURGO3FCQUNFLGNBQUEsUUFBSSxXQUFKLEFBQWM7Z0JBQWQ7a0JBQUE7QUFBQTtLQURGLEFBQ0UsQUFDQSwwQkFBQSxjQUFBLFFBQUksV0FBSixBQUFjO2dCQUFkO2tCQUFBO0FBQUE7S0FGRixBQUVFLEFBQ0EsNkJBQUEsY0FBQTtlQUFBLEFBQ1k7O2dCQURaO2tCQUFBO0FBQUE7QUFDRSxLQUpKLEFBR0UsQUFLQSxrSEFBQSxjQUFBLE9BQUcsTUFBSCxBQUFRLHFCQUFvQixXQUE1QixBQUFzQztnQkFBdEM7a0JBQUE7QUFBQTtLQVJGLEFBUUUsQUFDQSw4QkFBQSxjQUFBLE9BQUcsTUFBSCxBQUFRLHFCQUFvQixXQUE1QixBQUFzQztnQkFBdEM7a0JBQUE7QUFBQTtLQXREaEIsQUFDRSxBQUNFLEFBd0JFLEFBQ0UsQUFnQkUsQUFDRSxBQUNFLEFBU0UsQUFTakI7QUFFRDs7a0JBQUEsQUFBZSIsImZpbGUiOiJIb21lLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9iZWxhbC9EZXNrdG9wL3dlYmRldi9SZWFsaXRpZXMvcmVhbGl0aWVzL3VpIn0=