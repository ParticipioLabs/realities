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

function getTrimmedLabel(node) {
  return _.truncate(getNodeTitle(node), { length: 12, separator: ',.?! ' });
}

function getNodeDescription(node) {
  if (node.__typename === 'Person') return node.name ? node.email : null;
  return node.description;
}

function pushNode(graph, node, config = {}) {
  if (!_.find(graph.nodes, { id: node.nodeId })) {
    graph.nodes.push({
      id: node.nodeId,
      label: getTrimmedLabel(node),
      color: colorCollection[node.__typename],
      title: getNodeTitle(node),
      description: getNodeDescription(node),
      ...config,
    });
  }
}

function pushEdge(graph, originNode, node, relation, direction) {
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
}

function pushRelatedNode(graph, originNode, node, relation, direction) {
  if (!node) return graph;

  if (Array.isArray(node)) {
    node.forEach((element) => {
      pushRelatedNode(graph, originNode, element, relation, direction);
    });
    return graph;
  }

  pushNode(graph, node);
  pushEdge(graph, originNode, node, relation, direction);

  return graph;
}

function getSubGraph(originNode = {}) {
  const graph = {
    nodes: [],
    edges: [],
  };

  pushNode(graph, originNode, { shape: 'ellipse' });

  pushRelatedNode(graph, originNode, originNode.guide, 'Guides', 'OUT');
  pushRelatedNode(graph, originNode, originNode.realizer, 'Realizes', 'OUT');
  pushRelatedNode(graph, originNode, originNode.fulfills, 'Fulfills', 'IN');
  pushRelatedNode(graph, originNode, originNode.dependsOnNeeds, 'Depends on', 'IN');
  pushRelatedNode(graph, originNode, originNode.dependsOnResponsibilities, 'Depends on', 'IN');
  pushRelatedNode(graph, originNode, originNode.fulfilledBy, 'Fulfills', 'OUT');
  pushRelatedNode(graph, originNode, originNode.needsThatDependOnThis, 'Depends on', 'OUT');
  pushRelatedNode(graph, originNode, originNode.responsibilitiesThatDependOnThis, 'Depends on', 'OUT');

  return graph;
}

function getPersonGraph(originNode = {}) {
  const graph = {
    nodes: [],
    edges: [],
  };

  pushNode(graph, originNode, { shape: 'ellipse' });

  function pushNodesToSubsequentNodes(userNodeId, nodes, role, relation) {
    nodes.forEach((node) => {
      // The following check is to prevent duplicate edges between a
      // need/responsibility and a person.
      if (node[role] && node[role].nodeId !== userNodeId) {
        pushRelatedNode(graph, node, node[role], relation, 'IN');
      }
      // If node is a responsibility, add node for the need it fulfills and
      // for every responsibility that depends on it.
      if (node.__typename === 'Responsibility') {
        pushRelatedNode(graph, node, node.fulfills, 'Fulfills', 'IN');
        node.dependsOnResponsibilities.forEach((responsibility) => {
          pushRelatedNode(graph, node, responsibility, 'Depends On', 'IN');
        });
      }
    });
  }

  pushRelatedNode(graph, originNode, originNode.guidesNeeds, 'Guides', 'IN');
  pushNodesToSubsequentNodes(originNode.nodeId, originNode.guidesNeeds, 'realizer', 'Realizes');

  pushRelatedNode(graph, originNode, originNode.realizesNeeds, 'Realizes', 'IN');
  pushNodesToSubsequentNodes(originNode.nodeId, originNode.realizesNeeds, 'guide', 'Guides');

  pushRelatedNode(graph, originNode, originNode.guidesResponsibilities, 'Guides', 'IN');
  pushNodesToSubsequentNodes(originNode.nodeId, originNode.guidesResponsibilities, 'realizer', 'Realizes');

  pushRelatedNode(graph, originNode, originNode.realizesResponsibilities, 'Realizes', 'IN');
  pushNodesToSubsequentNodes(originNode.nodeId, originNode.realizesResponsibilities, 'guide', 'Guides');

  return graph;
}

function getMasterGraph({ responsibilities = [] }) {
  const graph = {
    nodes: [],
    edges: [],
  };

  const r = 3000;
  let theta = 0;
  const thetaIncrement = (2 * Math.PI) / responsibilities.length;

  responsibilities.forEach((responsibility) => {
    pushNode(
      graph,
      responsibility,
      {
        x: r * Math.cos(theta),
        y: r * Math.sin(theta),
      },
    );
    theta += thetaIncrement;
    pushRelatedNode(graph, responsibility, responsibility.guide, 'Guides', 'OUT');
    pushRelatedNode(graph, responsibility, responsibility.realizer, 'Realizes', 'OUT');
    pushRelatedNode(graph, responsibility, responsibility.dependsOnResponsibilities, 'Depends on', 'IN');
  });

  return graph;
}

export default { getSubGraph, getPersonGraph, getMasterGraph };
