import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import withAuth from 'components/withAuth';
import AddDependency from './components/AddDependency';
import DependencyList from './components/DependencyList';

const Dependencies = withAuth(withRouter(({
  auth,
  history,
  nodeType,
  nodeId,
  dependencies,
  showAddRemove,
}) => (
    <div>
      {auth.isLoggedIn && showAddRemove && (
        <AddDependency nodeType={nodeType} nodeId={nodeId} />
      )}
      <DependencyList
        dependencies={dependencies.map(dep => ({
          node: dep,
          onClick: () => history.push(dep.__typename === 'Need'
            ? `/${dep.nodeId}`
            : `/${dep.fulfills.nodeId}/${dep.nodeId}`),
        }))}
        showRemove={auth.isLoggedIn && showAddRemove}
      />
    </div>
  )));

Dependencies.propTypes = {
  auth: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  nodeType: PropTypes.string,
  nodeId: PropTypes.string,
  dependencies: PropTypes.arrayOf(PropTypes.shape({
    __typename: PropTypes.string,
    nodeId: PropTypes.string,
    title: PropTypes.string,
    fulfills: PropTypes.shape({
      nodeId: PropTypes.string,
    }),
  })),
  showAddRemove: PropTypes.bool,
};

Dependencies.defaultProps = {
  auth: {
    isLoggedIn: false,
  },
  history: {
    push: () => null,
  },
  nodeType: 'Need',
  nodeId: '',
  dependencies: [],
  showAddRemove: false,
};

export default Dependencies;
