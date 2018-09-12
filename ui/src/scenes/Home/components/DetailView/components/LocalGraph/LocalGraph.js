import React from 'react';
import PropTypes from 'prop-types';
import Graph from 'react-graph-vis';

const LocalGraph = ({ graph, options, events }) => (
  <div>
    <Graph graph={graph} options={options} events={events} style={{ height: '20em' }} />
  </div>
);

LocalGraph.defaultProps = {
  graph: {
    nodes: [
      { id: 1, label: 'Nothing to show', color: '#e04141' },
    ],
    edges: [{ from: 1, to: 1 }],
  },
  options: {
    layout: {
      improvedLayout: true,
    },
    edges: {
      color: '#000000',
      font: {
        align: 'top',
      },
      smooth: {
        enabled: true,
        type: 'dynamic',
        roundness: 0.5,
      },
    },
    nodes: {
      shape: 'box',
      font: {
        color: '#fff',
      },
    },
    physics: {
      barnesHut: {
        gravitationalConstant: -4000,
        centralGravity: 0.3,
        springLength: 95,
        springConstant: 0.04,
        damping: 0.09,
        avoidOverlap: 0,
      },
    },
  },
  events: {
    select: (event) => {
      const { nodes, edges } = event;
      console.log('Selected nodes:');
      console.log(nodes);
      console.log('Selected edges:');
      console.log(edges);
    },
  },
};

LocalGraph.propTypes = {
  graph: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  options: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  events: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

export default LocalGraph;
