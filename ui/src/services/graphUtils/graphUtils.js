import _ from 'lodash';
import colors from '@/styles/colors';

const colorCollection = {
  Need: colors.need,
  Responsibility: colors.responsibility,
  Person: colors.person,
};

function getNodeTitle(node) {
  return node.__typename === 'Person' ? (node.name || node.email) : node.title;
}

function getNodeDescription(node) {
  if (node.__typename === 'Person') return node.name ? node.email : null;
  return node.description;
}

function pushNode(graph, originNode, node, relation, direction) {
  if (!node) return graph;

  if (Array.isArray(node)) {
    node.forEach((element) => {
      pushNode(graph, originNode, element, relation, direction);
    });
    return graph;
  }

  const trimmedLabel = _.truncate(getNodeTitle(node), { length: 12, separator: ',.?! ' });
  if (!_.find(graph.nodes, { id: node.nodeId })) {
    graph.nodes.push({
      id: node.nodeId,
      label: trimmedLabel,
      color: colorCollection[node.__typename],
      title: getNodeTitle(node),
      description: getNodeDescription(node),
    });
  }
  if (direction === 'IN') {
    graph.edges.push({
      from: originNode.nodeId,
      to: node.nodeId,
      label: relation,
    });
  } else {
    graph.edges.push({
      from: node.nodeId,
      to: originNode.nodeId,
      label: relation,
    });
  }

  return graph;
}

function getSubGraph(originNode = {}) {
  const trimmedLabel = _.truncate(originNode.title, { length: 12, separator: ',.?! ' });
  const graph = {
    nodes: [
      {
        id: originNode.nodeId,
        label: trimmedLabel,
        color: colorCollection[originNode.__typename],
        title: originNode.title,
        shape: 'ellipse',
        description: originNode.description,
      },
    ],
    edges: [],
  };

  pushNode(graph, originNode, originNode.guide, 'Guides', 'OUT');
  pushNode(graph, originNode, originNode.realizer, 'Realizes', 'OUT');
  pushNode(graph, originNode, originNode.fulfills, 'Fulfills', 'IN');
  pushNode(graph, originNode, originNode.dependsOnNeeds, 'Depends on', 'IN');
  pushNode(graph, originNode, originNode.dependsOnResponsibilities, 'Depends on', 'IN');
  pushNode(graph, originNode, originNode.fulfilledBy, 'Fulfills', 'OUT');
  pushNode(graph, originNode, originNode.needsThatDependOnThis, 'Depends on', 'OUT');
  pushNode(graph, originNode, originNode.responsibilitiesThatDependOnThis, 'Depends on', 'OUT');

  return graph;
}
function getPersonGraph(originNode = {}) {
  const trimmedLabel = _.truncate(originNode.name, { length: 12, separator: ',.?! ' });
  const graph = {
    nodes: [
      {
        id: originNode.nodeId,
        label: trimmedLabel,
        color: colorCollection[originNode.__typename],
        title: originNode.name,
        shape: 'ellipse',
        description: originNode.description,
      },
    ],
    edges: [],
  };

  function pushNodesToSubsequentNodes(userNodeId, nodes, role, relation) {
    nodes.forEach((node) => {
      // The following check is to prevent duplicate edges between a
      // need/responsibility and a person.
      if (node[role] && node[role].nodeId !== userNodeId) {
        pushNode(graph, node, node[role], relation, 'IN');
      }
      // If node is a responsibility, add node for the need it fulfills and
      // for every responsibility that depends on it.
      if (node.__typename === 'Responsibility') {
        pushNode(graph, node, node.fulfills, 'Fulfills', 'IN');
        node.dependsOnResponsibilities.forEach((responsibility) => {
          pushNode(graph, node, responsibility, 'Depends On', 'IN');
        });
      }
    });
  }

  pushNode(graph, originNode, originNode.guidesNeeds, 'Guides', 'IN');
  pushNodesToSubsequentNodes(originNode.nodeId, originNode.guidesNeeds, 'realizer', 'Realizes');

  pushNode(graph, originNode, originNode.realizesNeeds, 'Realizes', 'IN');
  pushNodesToSubsequentNodes(originNode.nodeId, originNode.realizesNeeds, 'guide', 'Guides');

  pushNode(graph, originNode, originNode.guidesResponsibilities, 'Guides', 'IN');
  pushNodesToSubsequentNodes(originNode.nodeId, originNode.guidesResponsibilities, 'realizer', 'Realizes');

  pushNode(graph, originNode, originNode.realizesResponsibilities, 'Realizes', 'IN');
  pushNodesToSubsequentNodes(originNode.nodeId, originNode.realizesResponsibilities, 'guide', 'Guides');

  return graph;
}

export default { getSubGraph, getPersonGraph };
