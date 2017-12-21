import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Graph from "react-graph-vis";

const LocalGraph = function ({
  graph,
  options,
  events,
}) {
  return (
    <div>
      <Graph graph={graph} options={options} events={events} style={{ height: "20em" }} />
    </div>
  );
};

LocalGraph.defaultProps = {
  graph: {
        nodes: [
          { id: 1, label: 'Nothing to show', color: '#e04141' }
        ],
        edges: [{ from: 1, to: 1 }]
      },
  options: {
        layout: {
          improvedLayout: true
        },
        edges: {
          color: "#000000",
          font: {
            align: 'top'
          },
          smooth: {
            enabled: true,
            type: "dynamic",
            roundness: 0.5
          }
        },
        nodes: {
          shape: 'box',
          font: {
            color: "#fff"
          } 
        },
        physics: {
          barnesHut: {
            gravitationalConstant: -4000,
            centralGravity: 0.3,
            springLength: 95,
            springConstant: 0.04,
            damping: 0.09,
            avoidOverlap: 0
          }
        }
      },
  events: {
        select: function(event) {
          var { nodes, edges } = event;
          console.log("Selected nodes:");
          console.log(nodes);
          console.log("Selected edges:");
          console.log(edges);
        }
      }
};

LocalGraph.propTypes = {
  graph: PropTypes.object,
  options: PropTypes.object,
  events: PropTypes.object
};

export default LocalGraph;
