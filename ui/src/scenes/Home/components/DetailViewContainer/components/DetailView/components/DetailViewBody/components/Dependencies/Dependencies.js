import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import DependencyList from './components/DependencyList';

const Dependencies = withRouter(({ dependencies, history }) => (
  <div>
    <DependencyList
      dependencies={dependencies.map(dep => ({
        node: dep,
        onClick: () => history.push(dep.__typename === 'Need'
          ? `/${dep.nodeId}`
          : `/${dep.fulfills.nodeId}/${dep.nodeId}`),
      }))}
    />
  </div>
));

Dependencies.propTypes = {
  dependencies: PropTypes.arrayOf(PropTypes.shape({
    __typename: PropTypes.string,
    nodeId: PropTypes.string,
    title: PropTypes.string,
    fulfills: PropTypes.shape({
      nodeId: PropTypes.string,
    }),
  })),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};

Dependencies.defaultProps = {
  dependencies: [],
  history: {
    push: () => null,
  },
};

export default Dependencies;
