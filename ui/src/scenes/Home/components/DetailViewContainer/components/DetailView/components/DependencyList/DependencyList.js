import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem, Badge } from 'reactstrap';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

const RealitiesBadge = styled(Badge)`
  margin-right: .5em;
  background-color: ${props => props.badgecolor};
`;

const DependencyList = withRouter(({ dependencies, history }) => (
  <ListGroup>
    {dependencies.map(({
      __typename,
      nodeId,
      title,
      fulfills,
    }) => (
      <ListGroupItem
        key={nodeId}
        tag="button"
        href="#"
        action
        onClick={() => {
          history.push(__typename === 'Need' ? `/${nodeId}` : `/${fulfills.nodeId}/${nodeId}`);
        }}
      >
        <RealitiesBadge badgecolor={__typename === 'Need' ? '#00cf19' : '#843cfd'}>
          {__typename[0]}
        </RealitiesBadge>
        {title}
      </ListGroupItem>
    ))}
  </ListGroup>
));

DependencyList.propTypes = {
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

DependencyList.defaultProps = {
  dependencies: [],
  history: {
    push: () => null,
  },
};

export default DependencyList;
