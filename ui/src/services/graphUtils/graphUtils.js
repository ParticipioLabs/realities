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
  pushNode(graph, node, node.guide, 'Guides', 'OUT');
  pushNode(graph, node, node.realizer, 'Realizes', 'OUT');

  return graph;
}

function getSubGraph(originNode) {
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

export default { getSubGraph };
