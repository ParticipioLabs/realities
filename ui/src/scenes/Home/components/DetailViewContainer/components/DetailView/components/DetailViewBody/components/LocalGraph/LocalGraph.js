import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Graph from 'react-graph-vis';
import _ from 'lodash';
import {
  Popover,
  PopoverBody,
  PopoverHeader,
} from 'reactstrap';
import graphUtils from '@/services/graphUtils';
import WrappedLoader from '@/components/WrappedLoader';

const NEED_FRAGMENT = gql`
  fragment LocalGraphNeedFields on Need {
    nodeId
    title
    description
    guide {
      nodeId
      email
      name
    }
    realizer {
      nodeId
      email
      name
    }
  }
`;

const RESPONSIBILITY_FRAGMENT = gql`
  fragment LocalGraphResponsibilityFields on Responsibility {
    nodeId
    title
    description
    guide {
      nodeId
      email
      name
    }
    realizer {
      nodeId
      email
      name
    }
  }
`;

const GET_NEED = gql`
  query LocalGraph_need($nodeId: ID!) {
    need(nodeId: $nodeId) {
      ...LocalGraphNeedFields
      fulfilledBy {
        ...LocalGraphResponsibilityFields
      }
      dependsOnNeeds {
        ...LocalGraphNeedFields
      }
      dependsOnResponsibilities {
        ...LocalGraphResponsibilityFields
      }
      needsThatDependOnThis {
        ...LocalGraphNeedFields
      }
      responsibilitiesThatDependOnThis {
        ...LocalGraphResponsibilityFields
      }
    }
  }
  ${NEED_FRAGMENT}
  ${RESPONSIBILITY_FRAGMENT}
`;

const GET_RESPONSIBILITY = gql`
  query LocalGraph_responsibility($nodeId: ID!) {
    responsibility(nodeId: $nodeId) {
      ...LocalGraphResponsibilityFields
      fulfills {
        ...LocalGraphNeedFields
      }
      dependsOnNeeds {
        ...LocalGraphNeedFields
      }
      dependsOnResponsibilities {
        ...LocalGraphResponsibilityFields
      }
      needsThatDependOnThis {
        ...LocalGraphNeedFields
      }
      responsibilitiesThatDependOnThis {
        ...LocalGraphResponsibilityFields
      }
    }
  }
  ${NEED_FRAGMENT}
  ${RESPONSIBILITY_FRAGMENT}
`;

const graphOptions = {
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
};

class LocalGraph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedNode: null,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.nodeId !== this.props.nodeId) {
      this.setState({ selectedNode: null });
    }
  }

  onSelectNode = ({ nodes }, graphData) => {
    const selectedNodeId = nodes && nodes[0];
    const graphNode = _.find(graphData.nodes, { id: selectedNodeId });
    this.setState({ selectedNode: graphNode });
  };

  render() {
    const { nodeType, nodeId } = this.props;
    const { selectedNode } = this.state;
    return (
      <Query
        query={nodeType === 'Need' ? GET_NEED : GET_RESPONSIBILITY}
        variables={{ nodeId }}
      >
        {({ loading, error, data }) => {
          if (loading) return <WrappedLoader />;
          if (error) return `Error! ${error.message}`;
          const node = nodeType === 'Need' ? data.need : data.responsibility;
          const graphData = graphUtils.getSubGraph(node);
          return (
            <div>
              <div id="localGraphWrapper">
                <Graph
                  graph={graphData}
                  options={graphOptions}
                  events={{ select: event => this.onSelectNode(event, graphData) }}
                  style={{ height: '20em' }}
                />
              </div>
              <Popover
                placement="left"
                isOpen={!!selectedNode}
                target="localGraphWrapper"
              >
                <PopoverHeader>
                  {selectedNode && selectedNode.title}
                </PopoverHeader>
                <PopoverBody>
                  {_.truncate(
                    (selectedNode && selectedNode.description),
                    { length: 512, separator: ',.?! ' },
                  )}
                </PopoverBody>
              </Popover>
            </div>
          );
        }}
      </Query>
    );
  }
}

LocalGraph.propTypes = {
  nodeType: PropTypes.string,
  nodeId: PropTypes.string,
};

LocalGraph.defaultProps = {
  nodeType: '',
  nodeId: '',
};

export default LocalGraph;
