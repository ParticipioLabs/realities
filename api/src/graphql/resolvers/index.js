import uuidv4 from 'uuid/v4';
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
      // This could (and should) be replaced with a "filter" argument on the needs
      // and responsibilities fields once neo4j-graphql-js supports that
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
      // This could (and should) be replaced with a "filter" argument
      // on the persons field once neo4j-graphql-js supports that
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
      // TODO: Make sure connectors actually set this field.
      return obj._label;
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
      (obj, args, { user, driver }) => createNeed(driver, args, user.email),
    ),
    createResponsibility: combineResolvers(
      isAuthenticated,
      (obj, args, { user, driver }) => createResponsibility(driver, args, user.email),
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
    updateViewerName(_, params, { user, driver }) {
      const userRole = user.role;
      if (!userRole) {
        throw new Error("User isn't authenticated");
      }
      const queryParams = Object.assign(
        {},
        params,
        {
          email: user.email,
          personId: uuidv4(),
        },
      );
      // Use cypher FOREACH hack to only set nodeId for person if it isn't already set
      const query = `
        MERGE (person:Person {email:{email}})
        FOREACH (doThis IN CASE WHEN not(exists(person.nodeId)) THEN [1] ELSE [] END |
          SET person += {nodeId:{personId}, created:timestamp()})
        SET person.name = {name}
        RETURN person
      `;
      return runQuery(driver.session(), query, queryParams);
    },
    softDeleteNeed(_, params, { user, driver }) {
      const userRole = user.role;
      if (!userRole) {
        throw new Error("User isn't authenticated");
      }
      // Here we should check if the user has permission
      // to soft delete this particular need and if the need
      // is free of responsibilities and dependents
      const query = `
        MATCH (need:Need {nodeId: {nodeId}})
        SET need.deleted = timestamp()
        RETURN need
      `;
      return runQuery(driver.session(), query, params);
    },
    softDeleteResponsibility(_, params, { user, driver }) {
      const userRole = user.role;
      if (!userRole) {
        throw new Error("User isn't authenticated");
      }
      // Here we should check if the user has permission
      // to soft delete this particular responsibility and
      // if it is free of dependents
      const query = `
        MATCH (resp:Responsibility {nodeId: {nodeId}})-[:FULFILLS]->(need:Need)
        SET resp.deleted = timestamp()
        RETURN resp, need
      `;
      return runQuery(driver.session(), query, params, result => Object.assign(
        {},
        result.records[0].get('resp').properties,
        { fulfills: result.records[0].get('need').properties },
      ));
    },
    addNeedDependsOnNeeds(_, params, { user, driver }) {
      // This could probably be replaced if neo4j-graphql-js develops better support
      // for mutating relationships. Right now they require relationships to be
      // defined with the @relation directive, which we can't use because we have to
      // filter soft-deleted nodes in our relations in the schema.
      const userRole = user.role;
      if (!userRole) {
        throw new Error("User isn't authenticated");
      }
      const queryParams = {
        fromId: params.from.nodeId,
        toId: params.to.nodeId,
      };
      const query = `
        MATCH (fromNeed:Need {nodeId: {fromId}})
        MATCH (toNeed:Need {nodeId: {toId}})
        MERGE (fromNeed)-[:DEPENDS_ON]->(toNeed)
        WITH fromNeed, toNeed
        MATCH (fromNeed)-[:DEPENDS_ON]->(dependency:Need)
        WHERE NOT EXISTS(dependency.deleted)
        RETURN fromNeed, toNeed, dependency
        ORDER BY dependency.created DESC
      `;
      return runQuery(driver.session(), query, queryParams, (result) => {
        const fromNeed = result.records[0].get('fromNeed').properties;
        const toNeed = result.records[0].get('toNeed').properties;
        const dependencies = result.records.map(r => r.get('dependency').properties);
        return {
          from: Object.assign({}, fromNeed, { dependsOnNeeds: dependencies }),
          to: toNeed,
        };
      });
    },
    addNeedDependsOnResponsibilities(_, params, { user, driver }) {
      const userRole = user.role;
      if (!userRole) {
        throw new Error("User isn't authenticated");
      }
      const queryParams = {
        fromId: params.from.nodeId,
        toId: params.to.nodeId,
      };
      const query = `
        MATCH (fromNeed:Need {nodeId: {fromId}})
        MATCH (toResp:Responsibility {nodeId: {toId}})
        MERGE (fromNeed)-[:DEPENDS_ON]->(toResp)
        WITH fromNeed, toResp
        MATCH (fromNeed)-[:DEPENDS_ON]->(dependency:Responsibility)
        MATCH (dependency)-[:FULFILLS]->(fulfills:Need)
        WHERE NOT EXISTS(dependency.deleted)
        RETURN fromNeed, toResp, dependency, fulfills
        ORDER BY dependency.created DESC
      `;
      return runQuery(driver.session(), query, queryParams, (result) => {
        const fromNeed = result.records[0].get('fromNeed').properties;
        const toResp = result.records[0].get('toResp').properties;
        const dependencies = result.records.map(r => Object.assign(
          {},
          r.get('dependency').properties,
          { fulfills: r.get('fulfills').properties },
        ));
        return {
          from: Object.assign({}, fromNeed, { dependsOnResponsibilities: dependencies }),
          to: toResp,
        };
      });
    },
    addResponsibilityDependsOnNeeds(_, params, { user, driver }) {
      const userRole = user.role;
      if (!userRole) {
        throw new Error("User isn't authenticated");
      }
      const queryParams = {
        fromId: params.from.nodeId,
        toId: params.to.nodeId,
      };
      const query = `
        MATCH (fromResp:Responsibility {nodeId: {fromId}})
        MATCH (toNeed:Need {nodeId: {toId}})
        MERGE (fromResp)-[:DEPENDS_ON]->(toNeed)
        WITH fromResp, toNeed
        MATCH (fromResp)-[:DEPENDS_ON]->(dependency:Need)
        WHERE NOT EXISTS(dependency.deleted)
        RETURN fromResp, toNeed, dependency
        ORDER BY dependency.created DESC
      `;
      return runQuery(driver.session(), query, queryParams, (result) => {
        const fromResp = result.records[0].get('fromResp').properties;
        const toNeed = result.records[0].get('toNeed').properties;
        const dependencies = result.records.map(r => r.get('dependency').properties);
        return {
          from: Object.assign({}, fromResp, { dependsOnNeeds: dependencies }),
          to: toNeed,
        };
      });
    },
    addResponsibilityDependsOnResponsibilities(_, params, { user, driver }) {
      const userRole = user.role;
      if (!userRole) {
        throw new Error("User isn't authenticated");
      }
      const queryParams = {
        fromId: params.from.nodeId,
        toId: params.to.nodeId,
      };
      const query = `
        MATCH (fromResp:Responsibility {nodeId: {fromId}})
        MATCH (toResp:Responsibility {nodeId: {toId}})
        MERGE (fromResp)-[:DEPENDS_ON]->(toResp)
        WITH fromResp, toResp
        MATCH (fromResp)-[:DEPENDS_ON]->(dependency:Responsibility)
        MATCH (dependency)-[:FULFILLS]->(fulfills:Need)
        WHERE NOT EXISTS(dependency.deleted)
        RETURN fromResp, toResp, dependency, fulfills
        ORDER BY dependency.created DESC
      `;
      return runQuery(driver.session(), query, queryParams, (result) => {
        const fromResp = result.records[0].get('fromResp').properties;
        const toResp = result.records[0].get('toResp').properties;
        const dependencies = result.records.map(r => Object.assign(
          {},
          r.get('dependency').properties,
          { fulfills: r.get('fulfills').properties },
        ));
        return {
          from: Object.assign({}, fromResp, { dependsOnResponsibilities: dependencies }),
          to: toResp,
        };
      });
    },
    removeNeedDependsOnNeeds(_, params, { user, driver }) {
      const userRole = user.role;
      if (!userRole) {
        throw new Error("User isn't authenticated");
      }
      const queryParams = {
        fromId: params.from.nodeId,
        toId: params.to.nodeId,
      };
      const query = `
        MATCH (fromNeed:Need {nodeId: {fromId}})-[r:DEPENDS_ON]->(toNeed:Need {nodeId: {toId}})
        DELETE r
        WITH fromNeed, toNeed
        MATCH (fromNeed)
        OPTIONAL MATCH (fromNeed)-[:DEPENDS_ON]->(dependency:Need)
        WHERE NOT EXISTS(dependency.deleted)
        RETURN fromNeed, toNeed, dependency
        ORDER BY dependency.created DESC
      `;
      return runQuery(driver.session(), query, queryParams, (result) => {
        const fromNeed = result.records[0].get('fromNeed').properties;
        const toNeed = result.records[0].get('toNeed').properties;
        const dependencies = result.records
          .map(r => r.get('dependency'))
          .filter(d => !!d)
          .map(d => d.properties);
        return {
          from: Object.assign({}, fromNeed, { dependsOnNeeds: dependencies }),
          to: toNeed,
        };
      });
    },
    removeNeedDependsOnResponsibilities(_, params, { user, driver }) {
      const userRole = user.role;
      if (!userRole) {
        throw new Error("User isn't authenticated");
      }
      const queryParams = {
        fromId: params.from.nodeId,
        toId: params.to.nodeId,
      };
      const query = `
        MATCH (fromNeed:Need {nodeId: {fromId}})-[r:DEPENDS_ON]->(toResp:Responsibility {nodeId: {toId}})
        DELETE r
        WITH fromNeed, toResp
        MATCH (fromNeed)
        OPTIONAL MATCH
          (fromNeed)
          -[:DEPENDS_ON]->
          (dependency:Responsibility)
          -[:FULFILLS]->
          (fulfills:Need)
        WHERE NOT EXISTS(dependency.deleted)
        RETURN fromNeed, toResp, dependency, fulfills
        ORDER BY dependency.created DESC
      `;
      return runQuery(driver.session(), query, queryParams, (result) => {
        const fromNeed = result.records[0].get('fromNeed').properties;
        const toResp = result.records[0].get('toResp').properties;
        const dependencies = result.records
          .map(r => ({ d: r.get('dependency'), f: r.get('fulfills') }))
          .filter(r => r.d && r.f)
          .map(r => Object.assign(
            {},
            r.d.properties,
            { fulfills: r.f.properties },
          ));
        return {
          from: Object.assign({}, fromNeed, { dependsOnResponsibilities: dependencies }),
          to: toResp,
        };
      });
    },
    removeResponsibilityDependsOnNeeds(_, params, { user, driver }) {
      const userRole = user.role;
      if (!userRole) {
        throw new Error("User isn't authenticated");
      }
      const queryParams = {
        fromId: params.from.nodeId,
        toId: params.to.nodeId,
      };
      const query = `
        MATCH (fromResp:Responsibility {nodeId: {fromId}})-[r:DEPENDS_ON]->(toNeed:Need {nodeId: {toId}})
        DELETE r
        WITH fromResp, toNeed
        MATCH (fromResp)
        OPTIONAL MATCH (fromResp)-[:DEPENDS_ON]->(dependency:Need)
        WHERE NOT EXISTS(dependency.deleted)
        RETURN fromResp, toNeed, dependency
        ORDER BY dependency.created DESC
      `;
      return runQuery(driver.session(), query, queryParams, (result) => {
        const fromResp = result.records[0].get('fromResp').properties;
        const toNeed = result.records[0].get('toNeed').properties;
        const dependencies = result.records
          .map(r => r.get('dependency'))
          .filter(d => !!d)
          .map(d => d.properties);
        return {
          from: Object.assign({}, fromResp, { dependsOnNeeds: dependencies }),
          to: toNeed,
        };
      });
    },
    removeResponsibilityDependsOnResponsibilities(_, params, { user, driver }) {
      const userRole = user.role;
      if (!userRole) {
        throw new Error("User isn't authenticated");
      }
      const queryParams = {
        fromId: params.from.nodeId,
        toId: params.to.nodeId,
      };
      const query = `
        MATCH
          (fromResp:Responsibility {nodeId: {fromId}})
          -[r:DEPENDS_ON]->
          (toResp:Responsibility {nodeId: {toId}})
        DELETE r
        WITH fromResp, toResp
        MATCH (fromResp)
        OPTIONAL MATCH 
          (fromResp)
          -[:DEPENDS_ON]->
          (dependency:Responsibility)
          -[:FULFILLS]->
          (fulfills:Need)
        WHERE NOT EXISTS(dependency.deleted)
        RETURN fromResp, toResp, dependency, fulfills
        ORDER BY dependency.created DESC
      `;
      return runQuery(driver.session(), query, queryParams, (result) => {
        const fromResp = result.records[0].get('fromResp').properties;
        const toResp = result.records[0].get('toResp').properties;
        const dependencies = result.records
          .map(r => ({ d: r.get('dependency'), f: r.get('fulfills') }))
          .filter(r => r.d && r.f)
          .map(r => Object.assign(
            {},
            r.d.properties,
            { fulfills: r.f.properties },
          ));
        return {
          from: Object.assign({}, fromResp, { dependsOnResponsibilities: dependencies }),
          to: toResp,
        };
      });
    },
  },
};

export default resolvers;
