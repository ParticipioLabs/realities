import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import withAuth from '@/components/withAuth';
import AddDeliberation from './components/AddDeliberation';
import DeliberationList from './components/DeliberationList';

const Deliberations = withAuth(withRouter(({
  auth,
  history,
  nodeType,
  nodeId,
  deliberations,
  showAddRemove,
}) => (
  <div>
    {auth.isLoggedIn && showAddRemove && (
      <AddDeliberation nodeType={nodeType} nodeId={nodeId} />
    )}
    <DeliberationList
      deliberations={deliberations.map(info => ({
        node: info,
        onClick: () => history.push(`/${info.nodeId}`),
      }))}
      showRemove={auth.isLoggedIn && showAddRemove}
    />
  </div>
)));

Deliberations.propTypes = {
  auth: PropTypes.shape({
    isLoggedIn: PropTypes.bool,
  }),
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  nodeType: PropTypes.string,
  nodeId: PropTypes.string,
  deliberations: PropTypes.arrayOf(PropTypes.shape({
    __typename: PropTypes.string,
    nodeId: PropTypes.string,
    title: PropTypes.string,
    //fulfills: PropTypes.shape({
    //  nodeId: PropTypes.string,
    //}),
  })),
  showAddRemove: PropTypes.bool,
};

Deliberations.defaultProps = {
  auth: {
    isLoggedIn: false,
  },
  history: {
    push: () => null,
  },
  nodeType: 'Info',
  nodeId: '',
  deliberations: [],
  showAddRemove: false,
};

export default Deliberations;
