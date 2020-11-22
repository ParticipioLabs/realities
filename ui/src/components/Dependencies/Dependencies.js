import React from 'react';
import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';
import withAuth from 'components/withAuth';
import AddDependency from './components/AddDependency';
import DependencyList from './components/DependencyList';

const Dependencies = withAuth(({
  auth,
  nodeType,
  nodeId,
  dependencies,
  showAddRemove,
}) => {
  const history = useHistory();
  const { orgSlug } = useParams();
  return (
    <div>
      {auth.isLoggedIn && showAddRemove && (
      <AddDependency nodeType={nodeType} nodeId={nodeId} />
      )}
      <DependencyList
        dependencies={dependencies.map((dep) => ({
          node: dep,
          onClick: () => history.push(dep.__typename === 'Need'
            ? `/${orgSlug}/${dep.nodeId}`
            : `/${orgSlug}/${dep.fulfills.nodeId}/${dep.nodeId}`),
        }))}
        showRemove={auth.isLoggedIn && showAddRemove}
      />
    </div>
  );
});

Dependencies.propTypes = {
  auth: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
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
  nodeType: 'Need',
  nodeId: '',
  dependencies: [],
  showAddRemove: false,
};

export default Dependencies;
