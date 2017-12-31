import _ from 'lodash';

const colorCollection = {
  Need: '#00cf19',
  Responsibility: '#843cfd',
  Person: '#EF9322',
};

function pushNode(graph, originNode, node, nodeLabel, relation, direction) {
  if (!node) {
    return graph;
  }
  if (Array.isArray(node)) {
    node.forEach((element) => {
      pushNode(graph, originNode, element, nodeLabel, relation, direction);
    });
    return graph;
  }

  const trimmedLabel = _.truncate(node[nodeLabel], { length: 12, separator: ',.?! ' });
  if (!_.find(graph.nodes, { id: node.nodeId })) {
    graph.nodes.push({
      id: node.nodeId,
      label: trimmedLabel,
      color: colorCollection[node.__typename],
      title: node[nodeLabel],
      description: node.description,
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
  pushNode(graph, node, node.guide, 'name', 'Guides', 'OUT');
  pushNode(graph, node, node.realizer, 'name', 'Realizes', 'OUT');

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

  pushNode(graph, originNode, originNode.guide, 'name', 'Guides', 'OUT');
  pushNode(graph, originNode, originNode.realizer, 'name', 'Realizes', 'OUT');
  pushNode(graph, originNode, originNode.fulfills, 'title', 'Fulfills', 'IN');
  pushNode(graph, originNode, originNode.dependsOnNeeds, 'title', 'Depends on', 'IN');
  pushNode(graph, originNode, originNode.dependsOnResponsibilites, 'title', 'Depends on', 'IN');
  pushNode(graph, originNode, originNode.fulfilledBy, 'title', 'Fulfills', 'OUT');
  pushNode(graph, originNode, originNode.needsThatDependOnThis, 'title', 'Depends on', 'OUT');
  pushNode(graph, originNode, originNode.responsibilitiesThatDependOnThis, 'title', 'Depends on', 'OUT');

  return graph;
}

export default { getSubGraph };
