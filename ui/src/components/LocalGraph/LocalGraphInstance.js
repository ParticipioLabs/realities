import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { gql, useQuery } from '@apollo/client';
import Graph from 'react-graph-vis';
import _ from 'lodash';
import {
  Popover,
  PopoverBody,
  PopoverHeader,
} from 'reactstrap';
import graphUtils from 'services/graphUtils';
import WrappedLoader from 'components/WrappedLoader';

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
      dependsOnResponsibilities {
        ...LocalGraphResponsibilityFields
      }
      responsibilitiesThatDependOnThis {
        ...LocalGraphResponsibilityFields
      }
    }
  }
  ${NEED_FRAGMENT}
  ${RESPONSIBILITY_FRAGMENT}
`;

const NEED_ON_PERSON_FRAGMENT = gql`
  fragment NeedOnPerson on Need {
    nodeId
    title
    guide {
      nodeId
      name
    }
    fulfilledBy {
      nodeId
      title
      guide {
        nodeId
        name
      }
      realizer {
        nodeId
        name
      }
    }
  }
`;
const RESPONSIBILITY_ON_PERSON_FRAGMENT = gql`
  fragment ResponsibilityOnPerson on Responsibility {
    nodeId
    title
    dependsOnResponsibilities {
      nodeId
      title
      guide {
        nodeId
        name
      }
    }
    guide {
      nodeId
      name
    }
    realizer {
      nodeId
      name
    }
    fulfills {
      nodeId
      title
      guide {
        nodeId
        name
      }
    }
  }
`;
const GET_PERSON = gql`
  query LocalGraphPersonFields($nodeId: ID!) {
    person(nodeId: $nodeId) {
      nodeId
      name
      guidesNeeds {
        ...NeedOnPerson
      }
      guidesResponsibilities {
        ...ResponsibilityOnPerson
      }
      realizesResponsibilities {
        ...ResponsibilityOnPerson
      }
    }
  }
${NEED_ON_PERSON_FRAGMENT}
${RESPONSIBILITY_ON_PERSON_FRAGMENT}
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

const LocalGraphInstance = ({ nodeType, nodeId }) => {
  const [selectedNode, setSelectedNode] = useState(null);

  let gqlQuery;
  if (nodeType === 'Need') {
    gqlQuery = GET_NEED;
  } else if (nodeType === 'Responsibility') {
    gqlQuery = GET_RESPONSIBILITY;
  } else {
    gqlQuery = GET_PERSON;
  }

  const {
    loading,
    error,
    data,
    refetch,
  } = useQuery(gqlQuery, { variables: { nodeId, nodeType } });

  const onSelectNode = ({ nodes }, graphData) => {
    const selectedNodeId = nodes && nodes[0];
    const graphNode = _.find(graphData.nodes, { id: selectedNodeId });
    setSelectedNode(graphNode);
  };

  if (loading) return <WrappedLoader />;
  if (error) return `Error! ${error.message}`;
  // The next line is a temporary hack to make up for a bug in Apollo where
  // the query returns an empty data object sometimes:
  // https://github.com/apollographql/apollo-client/issues/3267
  if (!data.need && !data.responsibility && !data.person) refetch();

  let node;
  if (nodeType === 'Need') node = data.need;
  else if (nodeType === 'Responsibility') node = data.responsibility;
  else node = data.person;

  if (!node) return null;
  let graphData;
  if (nodeType === 'Person') graphData = graphUtils.getPersonGraph(node);
  else graphData = graphUtils.getSubGraph(node);
  return (
    <div>
      <div id="localGraphWrapper">
        <Graph
          graph={graphData}
          options={graphOptions}
          events={{ select: (event) => onSelectNode(event, graphData) }}
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
};

LocalGraphInstance.propTypes = {
  nodeType: PropTypes.string,
  nodeId: PropTypes.string,
};

LocalGraphInstance.defaultProps = {
  nodeType: '',
  nodeId: '',
};

export default LocalGraphInstance;
