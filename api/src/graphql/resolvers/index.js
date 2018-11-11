import { combineResolvers } from 'graphql-resolvers';
import {
  runQuery,
  findNodesByLabel,
  findNodeByLabelAndId,
  findNodeByLabelAndProperty,
  findNodesByRelationshipAndLabel,
  findNodeByRelationshipAndLabel,
  createNeed,
  createResponsibility,
  createViewer,
  updateReality,
  updateViewerName,
  softDeleteNode,
  addDependency,
  removeDependency,
} from '../connectors';
import { isAuthenticated } from '../authorization';

const resolvers = {
  // root entry point to GraphQL service
  Query: {
    persons(obj, args, { driver }) {
      return findNodesByLabel(driver, 'Person');
    },
    person(obj, { email }, { driver }) {
      return findNodeByLabelAndProperty(driver, 'Person', 'email', email);
    },
    needs(obj, args, { driver }) {
      return findNodesByLabel(driver, 'Need');
    },
    need(obj, { nodeId }, { driver }) {
      return findNodeByLabelAndId(driver, 'Need', nodeId);
    },
    responsibilities(obj, args, { driver }) {
      return findNodesByLabel(driver, 'Responsibility');
    },
    responsibility(obj, { nodeId }, { driver }) {
      return findNodeByLabelAndId(driver, 'Responsibility', nodeId);
    },
    searchNeedsAndResponsibilities(object, params, { driver }) {
      // TODO: Replace this field with a "filter" argument on the needs and responsibilities fields
      const query = `
        MATCH (n)
        WHERE
          (n:Need OR n:Responsibility)
          AND toLower(n.title) CONTAINS toLower({term})
          AND NOT EXISTS(n.deleted)
        OPTIONAL MATCH (n)-[:FULFILLS]->(f:Need)
        RETURN n, f
      `;
      return runQuery(driver.session(), query, params, (result) => {
        const records = result.records.map(r => ({
          node: r.get('n'),
          fulfills: r.get('f'),
        }));
        const needs = records
          .filter(r => r.node.labels[0] === 'Need')
          .map(r => r.node.properties);
        const responsibilities = records
          .filter(r => r.node.labels[0] === 'Responsibility')
          .map(r => Object.assign({}, r.node.properties, { fulfills: r.fulfills.properties }));
        return { needs, responsibilities };
      });
    },
    searchPersons(object, params, { driver }) {
      // TODO: Replace this field with a "filter" argument on the persons field
      const query = `
        MATCH (p:Person)
        WHERE
          (toLower(p.name) CONTAINS toLower({term}) OR toLower(p.email) CONTAINS toLower({term}))
          AND NOT EXISTS(p.deleted)
        RETURN p
      `;
      return runQuery(driver.session(), query, params, result => ({
        persons: result.records.map(r => r.get(0).properties),
      }));
    },
  },
  Person: {
    guidesNeeds({ nodeId }, args, { driver }) {
      return findNodesByRelationshipAndLabel(driver, nodeId, 'GUIDES', 'Need');
    },
    realizesNeeds({ nodeId }, args, { driver }) {
      return findNodesByRelationshipAndLabel(driver, nodeId, 'REALIZES', 'Need');
    },
    guidesResponsibilities({ nodeId }, args, { driver }) {
      return findNodesByRelationshipAndLabel(driver, nodeId, 'GUIDES', 'Responsibility');
    },
    realizesResponsibilities({ nodeId }, args, { driver }) {
      return findNodesByRelationshipAndLabel(driver, nodeId, 'REALIZES', 'Responsibility');
    },
  },
  Reality: {
    __resolveType(obj) {
      return obj.__label;
    },
    guide({ nodeId }, args, { driver }) {
      return findNodeByRelationshipAndLabel(driver, nodeId, 'GUIDES', 'Person', 'IN');
    },
    realizer({ nodeId }, args, { driver }) {
      return findNodeByRelationshipAndLabel(driver, nodeId, 'REALIZES', 'Person', 'IN');
    },
    dependsOnNeeds({ nodeId }, args, { driver }) {
      return findNodesByRelationshipAndLabel(driver, nodeId, 'DEPENDS_ON', 'Need');
    },
    dependsOnResponsibilities({ nodeId }, args, { driver }) {
      return findNodesByRelationshipAndLabel(driver, nodeId, 'DEPENDS_ON', 'Responsibility');
    },
    needsThatDependOnThis({ nodeId }, args, { driver }) {
      return findNodesByRelationshipAndLabel(driver, nodeId, 'DEPENDS_ON', 'Need', 'IN');
    },
    responsibilitiesThatDependOnThis({ nodeId }, args, { driver }) {
      return findNodesByRelationshipAndLabel(driver, nodeId, 'DEPENDS_ON', 'Responsibility', 'IN');
    },
  },
  Need: {
    fulfilledBy({ nodeId }, args, { driver }) {
      return findNodesByRelationshipAndLabel(driver, nodeId, 'FULFILLS', 'Responsibility', 'IN');
    },
  },
  Responsibility: {
    fulfills({ nodeId }, args, { driver }) {
      return findNodeByRelationshipAndLabel(driver, nodeId, 'FULFILLS', 'Need');
    },
  },
  Mutation: {
    createNeed: combineResolvers(
      isAuthenticated,
      (obj, { title }, { user, driver }) => createNeed(driver, { title }, user.email),
    ),
    createResponsibility: combineResolvers(
      isAuthenticated,
      (obj, { title, needId }, { user, driver }) =>
        createResponsibility(driver, { title, needId }, user.email),
    ),
    createViewer: combineResolvers(
      isAuthenticated,
      (obj, args, { user, driver }) => createViewer(driver, user.email),
    ),
    updateNeed: combineResolvers(
      isAuthenticated,
      (obj, args, { driver }) => updateReality(driver, args),
    ),
    updateResponsibility: combineResolvers(
      isAuthenticated,
      (obj, args, { driver }) => updateReality(driver, args),
    ),
    updateViewerName: combineResolvers(
      isAuthenticated,
      (obj, { name }, { user, driver }) => updateViewerName(driver, { name }, user.email),
    ),
    // TODO: Check if need is free of responsibilities and dependents before soft deleting
    softDeleteNeed: combineResolvers(
      isAuthenticated,
      (obj, { nodeId }, { driver }) => softDeleteNode(driver, { nodeId }),
    ),
    // TODO: Check if responsibility is free of dependents before soft deleting
    softDeleteResponsibility: combineResolvers(
      isAuthenticated,
      (obj, { nodeId }, { driver }) => softDeleteNode(driver, { nodeId }),
    ),
    addNeedDependsOnNeeds: combineResolvers(
      isAuthenticated,
      (obj, { from, to }, { driver }) => addDependency(driver, { from, to }),
    ),
    addNeedDependsOnResponsibilities: combineResolvers(
      isAuthenticated,
      (obj, { from, to }, { driver }) => addDependency(driver, { from, to }),
    ),
    addResponsibilityDependsOnNeeds: combineResolvers(
      isAuthenticated,
      (obj, { from, to }, { driver }) => addDependency(driver, { from, to }),
    ),
    addResponsibilityDependsOnResponsibilities: combineResolvers(
      isAuthenticated,
      (obj, { from, to }, { driver }) => addDependency(driver, { from, to }),
    ),
    removeNeedDependsOnNeeds: combineResolvers(
      isAuthenticated,
      (obj, { from, to }, { driver }) => removeDependency(driver, { from, to }),
    ),
    removeNeedDependsOnResponsibilities: combineResolvers(
      isAuthenticated,
      (obj, { from, to }, { driver }) => removeDependency(driver, { from, to }),
    ),
    removeResponsibilityDependsOnNeeds: combineResolvers(
      isAuthenticated,
      (obj, { from, to }, { driver }) => removeDependency(driver, { from, to }),
    ),
    removeResponsibilityDependsOnResponsibilities: combineResolvers(
      isAuthenticated,
      (obj, { from, to }, { driver }) => removeDependency(driver, { from, to }),
    ),
  },
};

export default resolvers;
