import _ from 'lodash';
import PropTypes from 'prop-types';

const colorCollection = {
	Need: '#00cf19',
	Responsibility: '#843cfd',
	Person: '#EF9322'
};

function pushNode(graph, originNode, node, nodeLabel, relation, direction) {
	if(!node){
		return graph;
	}
	if(Array.isArray(node)){
		_.forEach(node, function(node) {
			pushNode(graph, originNode, node, nodeLabel, relation, direction);
		});
		return graph;
	}
	let trimmedLabel = ((node[nodeLabel].length < 12) ? node[nodeLabel] : node[nodeLabel].substring(0,12) + '...');
	if (!_.find(graph.nodes, { id: node.nodeId })) {
		graph.nodes.push({
			id: node.nodeId,
			label: trimmedLabel,
			color: colorCollection[node.__typename],
			title: node[nodeLabel]
		});
	}
	if(direction === 'IN'){
		graph.edges.push({
			from: originNode.nodeId,
			to: node.nodeId,
			label: relation
		});
	} else {
		graph.edges.push({
			from: node.nodeId,
			to: originNode.nodeId,
			label: relation
		});
	}
	pushNode(graph, node, node.guide, 'name', 'Guides', 'OUT');
	pushNode(graph, node, node.realizer, 'name', 'Realizes', 'OUT');

	return graph;
}

function getSubGraph(originNode) {
	let trimmedLabel = ((originNode['title'].length < 12) ? originNode['title'] : originNode['title'].substring(0,12) + '...');
	let graph = {
		nodes: [
			{
				id: originNode.nodeId,
				label: trimmedLabel,
				color: colorCollection[originNode.__typename],
				title: originNode['title'],
				shape: 'ellipse'
			},
		],
		edges: []
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

export default {
	getSubGraph: getSubGraph
};