import React from 'react';
import PropTypes from 'prop-types';
import LocalGraphInstance from './LocalGraphInstance';

const LocalGraph = (props) => {
  const { nodeType, nodeId } = props;

  return (
    <LocalGraphInstance
      nodeType={nodeType}
      nodeId={nodeId}
      // we have this wrapper file to add this key, so that the graph state
      // resets when the nodeId changes
      key={nodeId}
    />
  );
};

LocalGraph.propTypes = {
  nodeType: PropTypes.string,
  nodeId: PropTypes.string,
};

LocalGraph.defaultProps = {
  nodeType: '',
  nodeId: '',
};

export default LocalGraph;
