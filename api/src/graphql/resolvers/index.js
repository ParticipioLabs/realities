import { combineResolvers } from 'graphql-resolvers';
import { PubSub } from 'apollo-server';

import {
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
  searchPersons,
  searchRealities,
} from '../connectors';
import { isAuthenticated } from '../authorization';

const pubsub = new PubSub();

const NEED_CREATED = 'NEED_CREATED';
const RESPONSIBILITY_CREATED = 'RESPONSIBILITY_CREATED';
const REALITY_DELETED = 'REALITY_DELETED';
const REALITY_UPDATED = 'REALITY_UPDATED';

const resolvers = {
  // root entry point to GraphQL service
  Subscription: {
    needCreated: { subscribe: () => pubsub.asyncIterator([NEED_CREATED]) },
    responsibilityCreated: { subscribe: () => pubsub.asyncIterator([RESPONSIBILITY_CREATED]) },
    realityDeleted: { subscribe: () => pubsub.asyncIterator([REALITY_DELETED]) },
    realityUpdated: { subscribe: () => pubsub.asyncIterator([REALITY_UPDATED]) },
  },
  Query: {
    persons(obj, { search }, { driver }) {
      if (search) return searchPersons(driver, search);
      return findNodesByLabel(driver, 'Person');
    },
    person(obj, { email }, { driver }) {
      return findNodeByLabelAndProperty(driver, 'Person', 'email', email);
    },
    needs(obj, { search }, { driver }) {
      if (search) return searchRealities(driver, 'Need', search);
      return findNodesByLabel(driver, 'Need');
    },
    need(obj, { nodeId }, { driver }) {
      return findNodeByLabelAndId(driver, 'Need', nodeId);
    },
    responsibilities(obj, { search, nodeId }, { driver }) {
      if (search) return searchRealities(driver, 'Responsibility', search);
      if (nodeId) return findNodesByRelationshipAndLabel(driver, nodeId, 'FULFILLS', 'Responsibility', 'IN');
      return findNodesByLabel(driver, 'Responsibility');
    },
    responsibility(obj, { nodeId }, { driver }) {
      return findNodeByLabelAndId(driver, 'Responsibility', nodeId);
    },
  },
  Person: {
    created({ created }) {
      return created.toString();
    },
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
    created({ created }) {
      return created.toString();
    },
    deleted({ deleted }) {
      return deleted.toString();
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
      (obj, { title }, { user, driver }) => {
        const resultPromise = createNeed(driver, { title }, user.email);
        resultPromise.then(need => pubsub.publish(NEED_CREATED, { needCreated: need }));
        return resultPromise;
      },
    ),
    createResponsibility: combineResolvers(
      isAuthenticated,
      (obj, { title, needId }, { user, driver }) => {
        const resultPromise = createResponsibility(driver, { title, needId }, user.email);
        resultPromise.then((responsibility) => {
          pubsub.publish(RESPONSIBILITY_CREATED, { responsibilityCreated: responsibility });
        });
        return resultPromise;
      },
    ),
    createViewer: combineResolvers(
      isAuthenticated,
      (obj, args, { user, driver }) => createViewer(driver, user.email),
    ),
    updateNeed: combineResolvers(
      isAuthenticated,
      (obj, args, { driver }) => updateReality(driver, args),
      // TODO: Trigger NEED_UPDATED here
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
      (obj, { nodeId }, { driver }) => {
        const resultPromise = softDeleteNode(driver, { nodeId });
        resultPromise.then(reality => pubsub.publish(REALITY_DELETED, { realityDeleted: reality }));
        return resultPromise;
      },
    ),
    // TODO: Check if responsibility is free of dependents before soft deleting
    softDeleteResponsibility: combineResolvers(
      isAuthenticated,
      (obj, { nodeId }, { driver }) => {
        const resultPromise = softDeleteNode(driver, { nodeId });
        resultPromise.then(reality => pubsub.publish(REALITY_DELETED, { realityDeleted: reality }));
        return resultPromise;
      },
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
