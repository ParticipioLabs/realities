import NormalizeUrl from 'normalize-url';
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
  changeFulfills,
  updateViewerName,
  softDeleteNode,
  addDependency,
  removeDependency,
  addRealityHasDeliberation,
  removeDeliberation,
  searchPersons,
  searchRealities,
  getEmailData,
} from '../connectors';
import { isAuthenticated } from '../authorization';
import { sendUpdateMail } from '../../email/mailService';

const notify = (process.env.EMAIL_NOTIFICATIONS === 'enabled');

const pubsub = new PubSub();

const REALITY_CREATED = 'REALITY_CREATED';
const REALITY_DELETED = 'REALITY_DELETED';
const REALITY_UPDATED = 'REALITY_UPDATED';

const resolvers = {
  // root entry point to GraphQL service
  Subscription: {
    realityCreated: { subscribe: () => pubsub.asyncIterator([REALITY_CREATED]) },
    realityDeleted: { subscribe: () => pubsub.asyncIterator([REALITY_DELETED]) },
    realityUpdated: { subscribe: () => pubsub.asyncIterator([REALITY_UPDATED]) },
  },
  Query: {
    persons(obj, { search }, { driver }) {
      if (search) return searchPersons(driver, search);
      return findNodesByLabel(driver, 'Person');
    },
    person(obj, { nodeId, email }, { driver }) {
      if (email) return findNodeByLabelAndProperty(driver, 'Person', 'email', email);
      if (nodeId) return findNodeByLabelAndId(driver, 'Person', nodeId);
      const errorMessage =
        'Field "person" arguments "email" of type "String" and "nodeId" of type "ID" ' +
        'were both undefined. Please provide at least one.';
      return new Error(errorMessage);
    },
    needs(obj, { search }, { driver }) {
      if (search) return searchRealities(driver, 'Need', search);
      return findNodesByLabel(driver, 'Need');
    },
    need(obj, { nodeId }, { driver }) {
      return findNodeByLabelAndId(driver, 'Need', nodeId);
    },
    responsibilities(obj, { search, fulfillsNeedId }, { driver }) {
      if (search) return searchRealities(driver, 'Responsibility', search);
      if (fulfillsNeedId) return findNodesByRelationshipAndLabel(driver, fulfillsNeedId, 'FULFILLS', 'Responsibility', 'IN');
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
    deliberations({ nodeId }, args, { driver }) {
      return findNodesByRelationshipAndLabel(driver, nodeId, 'HAS_DELIBERATION', 'Info');
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
      async (obj, { title }, { user, driver, viewedOrg }) => {
        const need = await createNeed(driver, { title }, { user, viewedOrg });
        pubsub.publish(REALITY_CREATED, { realityCreated: need });
        return need;
      },
    ),
    createResponsibility: combineResolvers(
      isAuthenticated,
      async (obj, { title, needId }, { user, driver }) => {
        const responsibility = await createResponsibility(driver, { title, needId }, user.email);
        pubsub.publish(REALITY_CREATED, { realityCreated: responsibility });
        return responsibility;
      },
    ),
    createViewer: combineResolvers(
      isAuthenticated,
      (obj, args, {
        user, viewedOrg, driver, coreModels,
      }) => createViewer({
        user, viewedOrg, driver, coreModels,
      }),
    ),
    updateNeed: combineResolvers(
      isAuthenticated,
      async (obj, args, { driver, user }) => {
        const emailData = await getEmailData(driver, args);
        const need = await updateReality(driver, args, user);
        pubsub.publish(REALITY_UPDATED, { realityUpdated: need });
        if (need && notify) {
          sendUpdateMail(
            driver,
            user,
            args,
            emailData,
            need,
          );
        }
        return need;
      },
    ),
    updateResponsibility: combineResolvers(
      isAuthenticated,
      async (obj, args, { driver, user }) => {
        const emailData = await getEmailData(driver, args);
        const responsibility = await updateReality(driver, args);
        pubsub.publish(REALITY_UPDATED, { realityUpdated: responsibility });
        if (responsibility && notify) {
          sendUpdateMail(
            driver,
            user,
            args,
            emailData,
            responsibility,
          );
        }
        return responsibility;
      },
    ),
    changeFulfills: combineResolvers(
      isAuthenticated,
      (obj, { responsibilityId, needId }, { driver }) =>
        changeFulfills(driver, { responsibilityId, needId }),
    ),
    updateViewerName: combineResolvers(
      isAuthenticated,
      (obj, { name }, { user, driver }) => updateViewerName(driver, { name }, user.email),
    ),
    // TODO: Check if need is free of responsibilities and dependents before soft deleting
    softDeleteNeed: combineResolvers(
      isAuthenticated,
      async (obj, { nodeId }, { driver }) => {
        const need = await softDeleteNode(driver, { nodeId });
        pubsub.publish(REALITY_DELETED, { realityDeleted: need });
        return need;
      },
    ),
    // TODO: Check if responsibility is free of dependents before soft deleting
    softDeleteResponsibility: combineResolvers(
      isAuthenticated,
      async (obj, { nodeId }, { driver }) => {
        const responsibility = await softDeleteNode(driver, { nodeId });
        pubsub.publish(REALITY_DELETED, { realityDeleted: responsibility });
        return responsibility;
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
    addRealityHasDeliberation: combineResolvers(
      isAuthenticated,
      (obj, { from, to }, { driver }) => {
        const normalizedTo = { url: NormalizeUrl(to.url, { stripHash: true }) };
        return addRealityHasDeliberation(driver, { from, to: normalizedTo });
      },
    ),
    removeRealityHasDeliberation: combineResolvers(
      isAuthenticated,
      (obj, { from, to }, { driver }) => removeDeliberation(driver, { from, to }),
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
