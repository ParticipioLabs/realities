'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactApollo = require('react-apollo');

var _head = require('next/dist/lib/head.js');

var _head2 = _interopRequireDefault(_head);

var _initApollo = require('./initApollo');

var _initApollo2 = _interopRequireDefault(_initApollo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _jsxFileName = '/Users/belal/Desktop/webdev/Realities/realities/ui/lib/withData.js';


// Gets the display name of a JSX component for dev tools
function getComponentDisplayName(Component) {
  return Component.displayName || Component.name || 'Unknown';
}

exports.default = function (ComposedComponent) {
  var WithData = function (_React$Component) {
    (0, _inherits3.default)(WithData, _React$Component);

    (0, _createClass3.default)(WithData, null, [{
      key: 'getInitialProps',
      value: function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(ctx) {
          var serverState, composedInitialProps, apollo, url;
          return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  serverState = { apollo: {} };

                  // Evaluate the composed component's getInitialProps()

                  composedInitialProps = {};

                  if (!ComposedComponent.getInitialProps) {
                    _context.next = 6;
                    break;
                  }

                  _context.next = 5;
                  return ComposedComponent.getInitialProps(ctx);

                case 5:
                  composedInitialProps = _context.sent;

                case 6:
                  if (process.browser) {
                    _context.next = 18;
                    break;
                  }

                  apollo = (0, _initApollo2.default)();
                  // Provide the `url` prop data in case a GraphQL query uses it

                  url = { query: ctx.query, pathname: ctx.pathname };
                  _context.prev = 9;
                  _context.next = 12;
                  return (0, _reactApollo.getDataFromTree)(_react2.default.createElement(_reactApollo.ApolloProvider, { client: apollo, __source: {
                      fileName: _jsxFileName,
                      lineNumber: 32
                    }
                  }, _react2.default.createElement(ComposedComponent, (0, _extends3.default)({ url: url }, composedInitialProps, {
                    __source: {
                      fileName: _jsxFileName,
                      lineNumber: 33
                    }
                  }))));

                case 12:
                  _context.next = 16;
                  break;

                case 14:
                  _context.prev = 14;
                  _context.t0 = _context['catch'](9);

                case 16:
                  // getDataFromTree does not call componentWillUnmount
                  // head side effect therefore need to be cleared manually
                  _head2.default.rewind();

                  // Extract query data from the Apollo store
                  serverState = {
                    apollo: {
                      data: apollo.cache.extract()
                    }
                  };

                case 18:
                  return _context.abrupt('return', (0, _extends3.default)({
                    serverState: serverState
                  }, composedInitialProps));

                case 19:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, this, [[9, 14]]);
        }));

        function getInitialProps(_x) {
          return _ref.apply(this, arguments);
        }

        return getInitialProps;
      }()
    }]);

    function WithData(props) {
      (0, _classCallCheck3.default)(this, WithData);

      var _this = (0, _possibleConstructorReturn3.default)(this, (WithData.__proto__ || (0, _getPrototypeOf2.default)(WithData)).call(this, props));

      _this.apollo = (0, _initApollo2.default)(_this.props.serverState.apollo.data);
      return _this;
    }

    (0, _createClass3.default)(WithData, [{
      key: 'render',
      value: function render() {
        return _react2.default.createElement(_reactApollo.ApolloProvider, { client: this.apollo, __source: {
            fileName: _jsxFileName,
            lineNumber: 66
          }
        }, _react2.default.createElement(ComposedComponent, (0, _extends3.default)({}, this.props, {
          __source: {
            fileName: _jsxFileName,
            lineNumber: 67
          }
        })));
      }
    }]);

    return WithData;
  }(_react2.default.Component);

  WithData.displayName = 'WithData(' + getComponentDisplayName(ComposedComponent) + ')';
  WithData.propTypes = {
    serverState: _propTypes2.default.shape({
      apollo: _propTypes2.default.object
    }).isRequired
  };
  return WithData;
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi93aXRoRGF0YS5qcyJdLCJuYW1lcyI6WyJSZWFjdCIsIlByb3BUeXBlcyIsIkFwb2xsb1Byb3ZpZGVyIiwiZ2V0RGF0YUZyb21UcmVlIiwiSGVhZCIsImluaXRBcG9sbG8iLCJnZXRDb21wb25lbnREaXNwbGF5TmFtZSIsIkNvbXBvbmVudCIsImRpc3BsYXlOYW1lIiwibmFtZSIsIkNvbXBvc2VkQ29tcG9uZW50IiwiV2l0aERhdGEiLCJjdHgiLCJzZXJ2ZXJTdGF0ZSIsImFwb2xsbyIsImNvbXBvc2VkSW5pdGlhbFByb3BzIiwiZ2V0SW5pdGlhbFByb3BzIiwicHJvY2VzcyIsImJyb3dzZXIiLCJ1cmwiLCJxdWVyeSIsInBhdGhuYW1lIiwicmV3aW5kIiwiZGF0YSIsImNhY2hlIiwiZXh0cmFjdCIsInByb3BzIiwicHJvcFR5cGVzIiwic2hhcGUiLCJvYmplY3QiLCJpc1JlcXVpcmVkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLEFBQU87Ozs7QUFDUCxBQUFPOzs7O0FBQ1AsQUFBUyxBQUFnQjs7QUFDekIsQUFBTzs7OztBQUNQLEFBQU8sQUFBZ0I7Ozs7Ozs7OztBQUV2QjtBQUNBLFNBQUEsQUFBUyx3QkFBVCxBQUFpQyxXQUFXLEFBQzFDO1NBQU8sVUFBQSxBQUFVLGVBQWUsVUFBekIsQUFBbUMsUUFBMUMsQUFBa0QsQUFDbkQ7QUFFRDs7a0JBQWUsVUFBQSxBQUFDLG1CQUFzQjtNQUFBLEFBQzlCLHVDQUQ4QjtzQ0FBQTs7O1dBQUE7eUJBQUE7NkdBQUEsQUFFTCxLQUZLO3lEQUFBO3dFQUFBO3NCQUFBOytDQUFBO3FCQUc1QjtBQUg0QixnQ0FHZCxFQUFFLFFBSFksQUFHZCxBQUFVLEFBRTVCOztBQUNJOztBQU40Qix5Q0FBQSxBQU1MOzt1QkFDdkIsa0JBUDRCLEFBT1YsaUJBUFU7b0NBQUE7QUFBQTtBQUFBOztrQ0FBQTt5QkFRRCxrQkFBQSxBQUFrQixnQkFSakIsQUFRRCxBQUFrQzs7cUJBQS9EO0FBUjhCLGtEQUFBOztxQkFBQTtzQkFhM0IsUUFiMkIsQUFhbkIsU0FibUI7b0NBQUE7QUFBQTtBQWN4Qjs7QUFkd0IsMkJBQUEsQUFjZixBQUNmO0FBQ007O0FBaEJ3Qix3QkFnQmxCLEVBQUUsT0FBTyxJQUFULEFBQWEsT0FBTyxVQUFVLElBaEJaLEFBZ0JsQixBQUFrQztrQ0FoQmhCO2tDQUFBOzJFQW9CMUIsQUFBQyw2Q0FBZSxRQUFoQixBQUF3QjtnQ0FBeEI7a0NBQUEsQUFDRTtBQURGO21CQUFBLGdDQUNFLEFBQUMsNENBQWtCLEtBQW5CLEFBQXdCLE9BQXhCLEFBQWlDOztnQ0FBakM7a0NBckJ3QixBQW1CdEIsQUFDSixBQUNFO0FBQUE7QUFBQSxzQkFGRTs7cUJBbkJzQjtrQ0FBQTtBQUFBOztxQkFBQTtrQ0FBQTtrREFBQTs7cUJBNkI5QjtBQUNBO0FBQ0E7aUNBQUEsQUFBSyxBQUVMOztBQUNBOzs7NEJBRVUsT0FBQSxBQUFPLE1BcENhLEFBa0M5QixBQUFjLEFBQ0osQUFDQSxBQUFhO0FBRGIsQUFDTjtBQUZVLEFBQ1o7O3FCQW5DNEI7O2lDQUFBO0FBMEM5QixxQkExQzhCLEFBMkMzQjs7cUJBM0MyQjtxQkFBQTtrQ0FBQTs7QUFBQTtpQ0FBQTtBQUFBOztxQ0FBQTtrQ0FBQTtBQUFBOztlQUFBO0FBQUEsQUErQ2xDO0FBL0NrQzs7c0JBK0NsQyxBQUFZLE9BQU87MENBQUE7OzRJQUFBLEFBQ1gsQUFDTjs7WUFBQSxBQUFLLFNBQVMsMEJBQVcsTUFBQSxBQUFLLE1BQUwsQUFBVyxZQUFYLEFBQXVCLE9BRi9CLEFBRWpCLEFBQWMsQUFBeUM7YUFDeEQ7QUFsRGlDOzs7V0FBQTsrQkFvRHpCLEFBQ1A7K0JBQ0UsQUFBQyw2Q0FBZSxRQUFRLEtBQXhCLEFBQTZCO3NCQUE3Qjt3QkFBQSxBQUNFO0FBREY7U0FBQSxnQ0FDRSxBQUFDLDhDQUFzQixLQUF2QixBQUE0Qjs7c0JBQTVCO3dCQUZKLEFBQ0UsQUFDRSxBQUdMO0FBSEs7QUFBQTtBQXZENEI7QUFBQTs7V0FBQTtJQUNiLGdCQURhLEFBQ1AsQUEyRDdCOztXQUFBLEFBQVMsNEJBQTBCLHdCQUFuQyxBQUFtQyxBQUF3QixxQkFDM0Q7V0FBQSxBQUFTO3FDQUNNLEFBQVU7Y0FDYixvQkFERyxBQUFnQixBQUNUO0FBRFMsQUFDM0IsS0FEVyxFQURmLEFBQXFCLEFBR2hCLEFBRUw7QUFMcUIsQUFDbkI7U0FJRixBQUFPLEFBQ1I7QUFuRUQiLCJmaWxlIjoid2l0aERhdGEuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2JlbGFsL0Rlc2t0b3Avd2ViZGV2L1JlYWxpdGllcy9yZWFsaXRpZXMvdWkifQ==