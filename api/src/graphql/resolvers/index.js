import NormalizeUrl from 'normalize-url';
import { combineResolvers } from 'graphql-resolvers';
import { PubSub, withFilter } from 'apollo-server';

import {
  findNodesByLabelAnyOrg,
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

function orgFromCore(org) {
  return {
    orgId: org._id,
    name: org.name,
    orgSlug: org.subdomain,
  };
}

function subWithFilter(type) {
  return {
    subscribe: withFilter(
      () => pubsub.asyncIterator([type]),
      (payload, variables, context) => {
        if (payload.orgId === undefined) {
          console.error('orgId not passed into subscription publish', payload);
        }
        return payload.orgId === context.viewedOrg.orgId;
      },
    ),
  };
}

const resolvers = {
  // root entry point to GraphQL service
  Subscription: {
    realityCreated: subWithFilter(REALITY_CREATED),
    realityDeleted: subWithFilter(REALITY_DELETED),
    realityUpdated: subWithFilter(REALITY_UPDATED),
  },
  Query: {
    persons(obj, { search }, { driver }) {
      if (search) return searchPersons(driver, search);
      return findNodesByLabelAnyOrg(driver, 'Person');
    },
    person(obj, { nodeId, email }, { driver }) {
      if (email) return findNodeByLabelAndProperty(driver, 'Person', 'email', email);
      if (nodeId) return findNodeByLabelAndId(driver, 'Person', nodeId);
      const errorMessage =
        'Field "person" arguments "email" of type "String" and "nodeId" of type "ID" ' +
        'were both undefined. Please provide at least one.';
      return new Error(errorMessage);
    },
    needs(obj, { search }, { driver, viewedOrg: { orgId } }) {
      if (search) return searchRealities(driver, 'Need', search, orgId);
      return findNodesByLabel(driver, 'Need', orgId);
    },
    need(obj, { nodeId }, { driver }) {
      return findNodeByLabelAndId(driver, 'Need', nodeId);
    },
    responsibilities(obj, { search, fulfillsNeedId }, { driver, viewedOrg: { orgId } }) {
      if (search) return searchRealities(driver, 'Responsibility', search, orgId);
      if (fulfillsNeedId) return findNodesByRelationshipAndLabel({ driver, orgId }, fulfillsNeedId, 'FULFILLS', 'Responsibility', 'IN');
      return findNodesByLabel(driver, 'Responsibility', orgId);
    },
    responsibility(obj, { nodeId }, { driver }) {
      return findNodeByLabelAndId(driver, 'Responsibility', nodeId);
    },
    async orgs(obj, args, { coreModels }) {
      const dbOrgs = await coreModels.Organization.find({});
      return dbOrgs.map(orgFromCore);
    },
    async org(obj, { orgSlug }, { coreModels }) {
      const org = await coreModels.Organization.findOne({ subdomain: orgSlug });
      return orgFromCore(org);
    },
  },
  Person: {
    created({ created }) {
      return created.toString();
    },
    guidesNeeds({ nodeId }, args, { driver, viewedOrg: { orgId } }) {
      return findNodesByRelationshipAndLabel({ driver, orgId }, nodeId, 'GUIDES', 'Need');
    },
    realizesNeeds({ nodeId }, args, { driver, viewedOrg: { orgId } }) {
      return findNodesByRelationshipAndLabel({ driver, orgId }, nodeId, 'REALIZES', 'Need');
    },
    guidesResponsibilities({ nodeId }, args, { driver, viewedOrg: { orgId } }) {
      return findNodesByRelationshipAndLabel({ driver, orgId }, nodeId, 'GUIDES', 'Responsibility');
    },
    realizesResponsibilities({ nodeId }, args, { driver, viewedOrg: { orgId } }) {
      return findNodesByRelationshipAndLabel({ driver, orgId }, nodeId, 'REALIZES', 'Responsibility');
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
    guide({ nodeId }, args, { driver, viewedOrg: { orgId } }) {
      return findNodeByRelationshipAndLabel({ driver, orgId }, nodeId, 'GUIDES', 'Person', 'IN');
    },
    realizer({ nodeId }, args, { driver, viewedOrg: { orgId } }) {
      return findNodeByRelationshipAndLabel({ driver, orgId }, nodeId, 'REALIZES', 'Person', 'IN');
    },
    dependsOnNeeds({ nodeId }, args, { driver, viewedOrg: { orgId } }) {
      return findNodesByRelationshipAndLabel({ driver, orgId }, nodeId, 'DEPENDS_ON', 'Need');
    },
    dependsOnResponsibilities({ nodeId }, args, { driver, viewedOrg: { orgId } }) {
      return findNodesByRelationshipAndLabel({ driver, orgId }, nodeId, 'DEPENDS_ON', 'Responsibility');
    },
    needsThatDependOnThis({ nodeId }, args, { driver, viewedOrg: { orgId } }) {
      return findNodesByRelationshipAndLabel({ driver, orgId }, nodeId, 'DEPENDS_ON', 'Need', 'IN');
    },
    responsibilitiesThatDependOnThis({ nodeId }, args, { driver, viewedOrg: { orgId } }) {
      return findNodesByRelationshipAndLabel({ driver, orgId }, nodeId, 'DEPENDS_ON', 'Responsibility', 'IN');
    },
    deliberations({ nodeId }, args, { driver, viewedOrg: { orgId } }) {
      return findNodesByRelationshipAndLabel({ driver, orgId }, nodeId, 'HAS_DELIBERATION', 'Info');
    },
  },
  Need: {
    fulfilledBy({ nodeId }, args, { driver, viewedOrg: { orgId } }) {
      return findNodesByRelationshipAndLabel({ driver, orgId }, nodeId, 'FULFILLS', 'Responsibility', 'IN');
    },
  },
  Responsibility: {
    fulfills({ nodeId }, args, { driver, viewedOrg: { orgId } }) {
      return findNodeByRelationshipAndLabel({ driver, orgId }, nodeId, 'FULFILLS', 'Need');
    },
  },
  Mutation: {
    createNeed: combineResolvers(
      isAuthenticated,
      async (obj, { title }, { user, driver, viewedOrg }) => {
        const need = await createNeed(driver, { title }, { user, viewedOrg });
        pubsub.publish(REALITY_CREATED, {
          realityCreated: need,
          // this isn't actually passed along to the user, since it's not in
          // the graphql schema i think. but we use it for filtering in the
          // subscriptions
          orgId: viewedOrg.orgId,
        });
        return need;
      },
    ),
    createResponsibility: combineResolvers(
      isAuthenticated,
      async (obj, { title, needId }, { user, driver, viewedOrg }) => {
        const responsibility = await createResponsibility(
          driver,
          { title, needId },
          { email: user.email, orgId: viewedOrg.orgId },
        );
        pubsub.publish(REALITY_CREATED, { realityCreated: responsibility, orgId: viewedOrg.orgId });
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
    createOrg: combineResolvers(
      isAuthenticated,
      async (obj, { name, orgSlug }, { coreModels }) => {
        const newOrg = new coreModels.Organization({
          name,
          subdomain: orgSlug,
        });
        const resOrg = await newOrg.save();
        return orgFromCore(resOrg);
      },
    ),
    updateNeed: combineResolvers(
      isAuthenticated,
      async (obj, args, { driver, user, viewedOrg }) => {
        const emailData = await getEmailData(driver, args);
        const need = await updateReality(driver, args, viewedOrg.orgId);
        pubsub.publish(REALITY_UPDATED, { realityUpdated: need, orgId: viewedOrg.orgId });
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
      async (obj, args, { driver, user, viewedOrg }) => {
        const emailData = await getEmailData(driver, args);
        const responsibility = await updateReality(driver, args, viewedOrg.orgId);
        pubsub.publish(REALITY_UPDATED, { realityUpdated: responsibility, orgId: viewedOrg.orgId });
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
      async (obj, { nodeId }, { driver, viewedOrg: { orgId } }) => {
        const need = await softDeleteNode(driver, { nodeId });
        pubsub.publish(REALITY_DELETED, { realityDeleted: need, orgId });
        return need;
      },
    ),
    // TODO: Check if responsibility is free of dependents before soft deleting
    softDeleteResponsibility: combineResolvers(
      isAuthenticated,
      async (obj, { nodeId }, { driver, viewedOrg: { orgId } }) => {
        const responsibility = await softDeleteNode(driver, { nodeId });
        pubsub.publish(REALITY_DELETED, { realityDeleted: responsibility, orgId });
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
