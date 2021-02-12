import _ from 'lodash';
import colors from 'styles/colors';

const colorCollection = {
  Need: colors.need,
  Responsibility: colors.responsibility,
  Person: colors.person,
};

function getNodeTitle(node) {
  return node.__typename === 'Person' ? (node.name || node.email) : node.title;
}

function getTrimmedLabel(node) {
  return _.truncate(getNodeTitle(node), { length: 20, separator: ',.?! ' });
}

function getNodeDescription(node) {
  if (node.__typename === 'Person') return node.name ? node.email : null;
  return node.description;
}

function pushNode(graph, node, config = {}) {
  if (!_.find(graph.nodes, { id: node.nodeId })) {
    graph.nodes.push({
      id: node.nodeId,
      __typename: node.__typename,
      label: getTrimmedLabel(node),
      color: colorCollection[node.__typename],
      title: getNodeTitle(node),
      description: getNodeDescription(node),
      ...config,
    });
  }
}

function pushEdge(graph, originNode, node, relation, direction, config = {}) {
  if (direction === 'IN') {
    graph.edges.push({
      from: originNode.nodeId,
      to: node.nodeId,
      label: relation,
      ...config,
    });
  } else {
    graph.edges.push({
      from: node.nodeId,
      to: originNode.nodeId,
      label: relation,
      ...config,
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

  pushRelatedNode(graph, originNode, originNode.guidesResponsibilities, 'Guides', 'IN');
  pushNodesToSubsequentNodes(originNode.nodeId, originNode.guidesResponsibilities, 'realizer', 'Realizes');

  pushRelatedNode(graph, originNode, originNode.realizesResponsibilities, 'Realizes', 'IN');
  pushNodesToSubsequentNodes(originNode.nodeId, originNode.realizesResponsibilities, 'guide', 'Guides');

  return graph;
}

function getPeopleFromResponsibilities(responsibilities) {
  const people = responsibilities.reduce((peopleAcc, responsibility) => {
    const { guide, realizer } = responsibility;

    function addPerson(person, respArrayKey) {
      if (!person) return;

      const foundPerson = _.find(peopleAcc, { nodeId: person.nodeId });

      if (foundPerson) {
        if (foundPerson[respArrayKey]) {
          foundPerson[respArrayKey].push(responsibility);
        } else {
          foundPerson[respArrayKey] = [responsibility];
        }
      } else {
        peopleAcc.push({
          ...person,
          [respArrayKey]: [responsibility],
        });
      }
    }

    addPerson(guide, 'guidesResponsibilities');
    addPerson(realizer, 'realizesResponsibilities');

    return peopleAcc;
  }, []);

  const sortedPeople = _.sortBy(
    people,
    [
      (p) => (p.realizesResponsibilities ? p.realizesResponsibilities.length : 0),
    ],
  );

  return sortedPeople;
}

function getRadius(numberOfNodes, nodeSpace) {
  const circumference = nodeSpace * numberOfNodes;
  return circumference / (2 * Math.PI);
}

function getThetaIncrement(numberOfNodes) {
  return numberOfNodes
    ? (2 * Math.PI) / numberOfNodes
    : null;
}

function getMasterGraph({ responsibilities = [] }, highlightedEdge) {
  const graph = {
    nodes: [],
    edges: [],
  };

  const nodeSpace = 100;
  const minSpaceBetweenCircles = 500;

  // Add unclaimed responsibilities as inner circle
  // ----------------------------------------------------------------------
  const unclaimedResponsibilities = responsibilities.filter((r) => !r.realizer);

  const unclaimedRadius = getRadius(unclaimedResponsibilities.length, nodeSpace);
  const unclaimedThetaIncrement = getThetaIncrement(unclaimedResponsibilities.length);

  unclaimedResponsibilities.forEach((resp, i) => {
    pushNode(
      graph,
      resp,
      {
        x: unclaimedRadius * Math.cos(unclaimedThetaIncrement * i),
        y: unclaimedRadius * Math.sin(unclaimedThetaIncrement * i),
      },
    );
  });

  // Add claimed responsibilities to middle circle and people to outer circle
  // ----------------------------------------------------------------------
  const people = getPeopleFromResponsibilities(responsibilities);

  const numberOfSlotsInClaimedCircle = people.reduce((acc, person) => {
    // Circle of claimed responsibilities should leave empty spaces for people
    // that guide responsibilities but don't realize any
    const increment = person.realizesResponsibilities
      ? person.realizesResponsibilities.length
      : 1;
    return acc + increment;
  }, 0);

  const claimedRadius = Math.max(
    getRadius(numberOfSlotsInClaimedCircle, nodeSpace),
    unclaimedRadius + minSpaceBetweenCircles,
  );
  const claimedThetaIncrement = getThetaIncrement(numberOfSlotsInClaimedCircle);

  const peopleRadius = claimedRadius + minSpaceBetweenCircles;

  let claimedIndex = 0;
  const peopleWithCoordinates = people.map((person) => {
    if (person.realizesResponsibilities) {
      const responsibilitiesWithCoordinates = person.realizesResponsibilities.map((resp) => {
        const respWithCoordinates = {
          ...resp,
          theta: claimedThetaIncrement * claimedIndex,
          x: claimedRadius * Math.cos(claimedThetaIncrement * claimedIndex),
          y: claimedRadius * Math.sin(claimedThetaIncrement * claimedIndex),
        };
        claimedIndex += 1;
        return respWithCoordinates;
      });
      const personTheta = _.mean(_.map(responsibilitiesWithCoordinates, 'theta'));
      return {
        ...person,
        x: peopleRadius * Math.cos(personTheta),
        y: peopleRadius * Math.sin(personTheta),
        realizesResponsibilities: responsibilitiesWithCoordinates,
      };
    }
    const personWithCoordinates = {
      ...person,
      x: peopleRadius * Math.cos(claimedThetaIncrement * claimedIndex),
      y: peopleRadius * Math.sin(claimedThetaIncrement * claimedIndex),
    };
    claimedIndex += 1;
    return personWithCoordinates;
  });

  peopleWithCoordinates.forEach((person) => {
    if (person.realizesResponsibilities) {
      person.realizesResponsibilities.forEach((resp) => {
        pushNode(graph, resp, { x: resp.x, y: resp.y });
      });
    }
    pushNode(graph, person, { x: person.x, y: person.y });
  });

  // Add edges
  // ----------------------------------------------------------------------
  responsibilities.forEach((responsibility) => {
    const { guide, realizer, dependsOnResponsibilities } = responsibility;

    if (guide) {
      pushEdge(graph, responsibility, guide, 'Guides', 'OUT', {
        color: {
          color: colors.guide,
          highlight: colors.guide,
          inherit: false,
          opacity: highlightedEdge === 'guides' ? 1 : 0.2,
        },
        width: highlightedEdge === 'guides' ? 10 : 1,
      });
    }

    if (realizer) {
      pushEdge(graph, responsibility, realizer, 'Realizes', 'OUT', {
        color: {
          color: colors.realizer,
          highlight: colors.realizer,
          inherit: false,
          opacity: highlightedEdge === 'realizes' ? 1 : 0.2,
        },
        width: highlightedEdge === 'realizes' ? 10 : 1,
      });
    }

    dependsOnResponsibilities.forEach((dependency) => {
      pushEdge(graph, responsibility, dependency, 'Depends on', 'IN', {
        color: {
          color: colors.dependency,
          highlight: colors.dependency,
          inherit: false,
          opacity: highlightedEdge === 'depends_on' ? 1 : 0.2,
        },
        width: highlightedEdge === 'depends_on' ? 10 : 1,
      });
    });
  });

  return graph;
}

export default { getSubGraph, getPersonGraph, getMasterGraph };
