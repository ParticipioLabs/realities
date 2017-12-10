'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = initApollo;

var _apolloClient = require('apollo-client');

var _apolloLinkHttp = require('apollo-link-http');

var _bundle = require('apollo-cache-inmemory/lib/bundle.umd');

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var apolloClient = null;

// Polyfill fetch() on the server (used by apollo-client)
// Remove /lib... once Apollo releases this fix: https://github.com/apollographql/apollo-client/pull/2648
if (!process.browser) {
  global.fetch = _isomorphicFetch2.default;
}

function create(initialState) {
  return new _apolloClient.ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: new _apolloLinkHttp.HttpLink({
      uri: 'http://localhost:3100/graphql', // Server URL (must be absolute)
      opts: {
        credentials: 'same-origin' // Additional fetch() options like `credentials` or `headers`
      }
    }),
    cache: new _bundle.InMemoryCache().restore(initialState || {})
  });
}

function initApollo(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxpYi9pbml0QXBvbGxvLmpzIl0sIm5hbWVzIjpbIkFwb2xsb0NsaWVudCIsIkh0dHBMaW5rIiwiSW5NZW1vcnlDYWNoZSIsImZldGNoIiwiYXBvbGxvQ2xpZW50IiwicHJvY2VzcyIsImJyb3dzZXIiLCJnbG9iYWwiLCJjcmVhdGUiLCJpbml0aWFsU3RhdGUiLCJjb25uZWN0VG9EZXZUb29scyIsInNzck1vZGUiLCJsaW5rIiwidXJpIiwib3B0cyIsImNyZWRlbnRpYWxzIiwiY2FjaGUiLCJyZXN0b3JlIiwiaW5pdEFwb2xsbyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBLEFBQVM7O0FBQ1QsQUFBUzs7QUFDVCxBQUFTLEEsQUFBVDs7QUFDQSxBQUFPOzs7Ozs7QUFFUCxJQUFJLGVBQUosQUFBbUI7O0FBRW5CO0FBTHNFO0FBTXRFLElBQUksQ0FBQyxRQUFMLEFBQWEsU0FBUyxBQUNwQjtTQUFBLEFBQU8sQUFBUSxBQUNoQjs7O0FBRUQsU0FBQSxBQUFTLE9BQVQsQUFBZ0IsY0FBYyxBQUM1Qjs7dUJBQ3FCLFFBREcsQUFDSyxBQUMzQjthQUFTLENBQUMsUUFGWSxBQUVKLFNBQVMsQUFDM0I7O1dBQW1CLEFBQ1osaUNBQWlDLEFBQ3RDOztxQkFBTSxBQUNTLGNBTkssQUFHaEIsQUFBYSxBQUVYLEFBQ3dCLEFBR2hDO0FBSlEsQUFDSjtBQUhlLEFBQ2pCLEtBREksQUFBSTtXQU1ILEFBQUksNEJBQUosQUFBb0IsUUFBUSxnQkFUckMsQUFBTyxBQUFpQixBQVNmLEFBQTRDLEFBRXREO0FBWHlCLEFBQ3RCLEdBREssQUFBSTtBQWFiOztBQUFlLFNBQUEsQUFBUyxXQUFULEFBQW9CLGNBQWMsQUFDL0M7QUFDQTtBQUNBO01BQUksQ0FBQyxRQUFMLEFBQWEsU0FBUyxBQUNwQjtXQUFPLE9BQVAsQUFBTyxBQUFPLEFBQ2Y7QUFFRDs7QUFDQTtNQUFJLENBQUosQUFBSyxjQUFjLEFBQ2pCO21CQUFlLE9BQWYsQUFBZSxBQUFPLEFBQ3ZCO0FBRUQ7O1NBQUEsQUFBTyxBQUNSIiwiZmlsZSI6ImluaXRBcG9sbG8uanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2JlbGFsL0Rlc2t0b3Avd2ViZGV2L1JlYWxpdGllcy9yZWFsaXRpZXMvdWkifQ==