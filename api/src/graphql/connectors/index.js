import _ from 'lodash';
import uuidv4 from 'uuid/v4';

// This fist connector works differently than the rest.
// It does not get Nodes, but data records that can be from a calculation.
// Because of this, it does not assign a __label propery.
function runQueryAndGetRawData(session, query, params) {
  return session.run(query, params)
    .then((result) => {
      session.close();
      if (!result.records) return null;
      return result.records[0].toObject();
    });
}

function runQueryAndGetRecords(session, query, params) {
  return session.run(query, params)
    .then((result) => {
      session.close();
      if (!result.records) return null;
      return result.records.map((r) => {
        const { properties, labels } = r.get(0);
        return Object.assign({}, properties, { __label: labels[0] });
      });
    });
}

function runQueryAndGetRecord(session, query, params) {
  return runQueryAndGetRecords(session, query, params)
    .then((records) => {
      if (!records || records.length !== 1) return null;
      return records[0];
    });
}

function runQueryAndGetRecordsWithFields(session, query, params) {
  return session.run(query, params)
    .then((result) => {
      session.close();
      if (!result.records) return null;
      return result.records.map((r) => {
        const pairs = r.keys.map((key) => {
          const { properties, labels } = r.get(key);
          return [key, Object.assign({}, properties, { __label: labels[0] })];
        });
        return _.fromPairs(pairs);
      });
    });
}

function runQueryAndGetRecordWithFields(session, query, params) {
  return runQueryAndGetRecordsWithFields(session, query, params)
    .then((records) => {
      if (!records || records.length !== 1) return null;
      return records[0];
    });
}

export function findNodesByLabel(driver, label) {
  const query = `
    MATCH (n:${label})
    WHERE NOT EXISTS(n.deleted)
    RETURN n ORDER BY n.created DESC
  `;
  return runQueryAndGetRecords(driver.session(), query, { label });
}

export function findNodeByLabelAndId(driver, label, nodeId) {
  const query = `
    MATCH (n:${label} {nodeId: {nodeId}})
    WHERE NOT EXISTS(n.deleted)
    RETURN n
  `;
  return runQueryAndGetRecord(driver.session(), query, { nodeId });
}

export function findNodeByLabelAndProperty(driver, label, propertyKey, propertyValue) {
  const query = `
    MATCH (n:${label} {${propertyKey}: {value}})
    WHERE NOT EXISTS(n.deleted)
    RETURN n
  `;
  return runQueryAndGetRecord(driver.session(), query, { value: propertyValue });
}

function getRelationshipQuery(relationship, label, direction) {
  const relationshipFragment =
    direction && direction.toUpperCase() === 'IN'
      ? `<-[:${relationship.toUpperCase()}]-`
      : `-[:${relationship.toUpperCase()}]->`;
  const labelFragment =
    label === ''
      ? '(n)'
      : `(n:${label})`;
  const query = `
    MATCH ({nodeId: {nodeId}})${relationshipFragment}${labelFragment}
    WHERE NOT EXISTS(n.deleted)
    RETURN n ORDER BY n.created DESC`;
  return query;
}

export function findNodesByRelationshipAndLabel(
  driver,
  originNodeId,
  relationship,
  label,
  direction,
) {
  const query = getRelationshipQuery(relationship, label, direction);
  return runQueryAndGetRecords(driver.session(), query, { nodeId: originNodeId });
}

export function findNodeByRelationshipAndLabel(
  driver,
  originNodeId,
  relationship,
  label,
  direction,
) {
  const query = getRelationshipQuery(relationship, label, direction);
  return runQueryAndGetRecord(driver.session(), query, { nodeId: originNodeId });
}

export function createNeed(driver, { title }, userEmail) {
  const queryParams = {
    title,
    email: userEmail,
    needId: uuidv4(),
  };
  // Use cypher FOREACH hack to only set nodeId for person if it isn't already set
  const query = `
    MATCH (person:Person {email:{email}})
    CREATE (need:Need {title:{title}, nodeId:{needId}, created:timestamp()})
    CREATE (person)-[:GUIDES]->(need)
    CREATE (person)-[:REALIZES]->(need)
    RETURN need
  `;
  return runQueryAndGetRecord(driver.session(), query, queryParams);
}

export function createResponsibility(driver, { title, needId }, userEmail) {
  const queryParams = {
    title,
    needId,
    email: userEmail,
    responsibilityId: uuidv4(),
  };
  // Use cypher FOREACH hack to only set nodeId for person if it isn't already set
  const query = `
    MATCH (need:Need {nodeId: {needId}})
    WITH need
    MATCH (person:Person {email:{email}})
    CREATE (resp:Responsibility {
      title:{title},
      nodeId:{responsibilityId},
      created:timestamp()
    })-[r:FULFILLS]->(need)
    CREATE (person)-[:GUIDES]->(resp)
    RETURN resp
  `;
  return runQueryAndGetRecord(driver.session(), query, queryParams);
}

export function addRealityHasDeliberation(driver, { from, to }) {
  const queryParams = {
    realityId: from.nodeId,
    infoUrl: to.url,
    infoId: uuidv4(),
  };
  // Use cypher FOREACH hack to only set nodeId for info if it isn't already set
  const query = `
    MATCH (reality {nodeId: {realityId}})
    WITH reality
    MERGE (info:Info {url: {infoUrl}})
    FOREACH (doThis IN CASE WHEN not(exists(info.nodeId)) THEN [1] ELSE [] END |
      SET info += {nodeId:{infoId}, created:timestamp()})
    WITH reality, info
    MERGE (reality)-[:HAS_DELIBERATION]->(info)
    RETURN reality as from, info as to
  `;
  return runQueryAndGetRecordWithFields(driver.session(), query, queryParams);
}

export function createInfo(driver, { title }, infoUrl) {
  const queryParams = {
    title,
    url: infoUrl,
    infoId: uuidv4(),
  };
  // Use cypher FOREACH hack to only set nodeId for info if it isn't already set
  const query = `
    MERGE (info:Info {url: {url}})
    FOREACH (doThis IN CASE WHEN not(exists(info.nodeId)) THEN [1] ELSE [] END |
      SET info += {nodeId:{infoId}, created:timestamp(), title: {title}})
    SET info.title = {title}
    RETURN info
  `;
  return runQueryAndGetRecord(driver.session(), query, queryParams);
}

export function createViewer(driver, userEmail) {
  const queryParams = {
    email: userEmail,
    personId: uuidv4(),
  };
  // Use cypher FOREACH hack to only set nodeId for person if it isn't already set
  const query = `
    MERGE (person:Person {email:{email}})
    FOREACH (doThis IN CASE WHEN not(exists(person.nodeId)) THEN [1] ELSE [] END |
      SET person += {nodeId:{personId}, created:timestamp()})
    RETURN person
  `;
  return runQueryAndGetRecord(driver.session(), query, queryParams);
}

export function updateReality(driver, args) {
  // Use cypher FOREACH hack to only set realizer
  // if the Person node could be found
  const query = `
    MATCH (reality {nodeId: {nodeId}})
    MATCH (:Person)-[g:GUIDES]->(reality)
    MATCH (guide:Person {email: {guideEmail}})
    OPTIONAL MATCH (:Person)-[r:REALIZES]->(reality)
    OPTIONAL MATCH (realizer:Person {email: {realizerEmail}})
    SET reality += {
      title: {title},
      description: {description},
      deliberationLink: {deliberationLink}
    }
    DELETE g, r
    CREATE (guide)-[:GUIDES]->(reality)
    FOREACH (doThis IN CASE WHEN realizer IS NOT NULL THEN [1] ELSE [] END |
      CREATE (realizer)-[:REALIZES]->(reality))
    RETURN reality
  `;
  return runQueryAndGetRecord(driver.session(), query, args);
}

export function changeFulfills(driver, { responsibilityId, needId }) {
  const queryParams = {
    responsibilityId,
    needId,
  };

  const query = `
    MATCH (resp:Responsibility {nodeId: {responsibilityId}})-[r:FULFILLS]->(n1:Need)
    MATCH (n2:Need {nodeId: {needId}})
    CREATE (resp)-[r2:FULFILLS]->(n2)
    DELETE r
    RETURN resp
  `;

  return runQueryAndGetRecord(driver.session(), query, queryParams);
}

export function updateViewerName(driver, { name }, userEmail) {
  const queryParams = {
    name,
    email: userEmail,
    personId: uuidv4(),
  };
  // Use cypher FOREACH hack to only set nodeId for person if it isn't already set
  const query = `
    MERGE (person:Person {email:{email}})
    FOREACH (doThis IN CASE WHEN not(exists(person.nodeId)) THEN [1] ELSE [] END |
      SET person += {nodeId:{personId}, created:timestamp()})
    SET person.name = {name}
    RETURN person
  `;
  return runQueryAndGetRecord(driver.session(), query, queryParams);
}

export function softDeleteNode(driver, { nodeId }) {
  const query = `
    MATCH (n {nodeId: {nodeId}})
    SET n.deleted = timestamp()
    RETURN n
  `;
  return runQueryAndGetRecord(driver.session(), query, { nodeId });
}

export function addDependency(driver, { from, to }) {
  const queryParams = {
    fromId: from.nodeId,
    toId: to.nodeId,
  };
  const query = `
    MATCH (from {nodeId: {fromId}})
    MATCH (to {nodeId: {toId}})
    MERGE (from)-[:DEPENDS_ON]->(to)
    RETURN from, to
  `;
  return runQueryAndGetRecordWithFields(driver.session(), query, queryParams);
}

export function removeDependency(driver, { from, to }) {
  const queryParams = {
    fromId: from.nodeId,
    toId: to.nodeId,
  };
  const query = `
    MATCH (from {nodeId: {fromId}})-[r:DEPENDS_ON]->(to {nodeId: {toId}})
    DELETE r
    RETURN from, to
  `;
  return runQueryAndGetRecordWithFields(driver.session(), query, queryParams);
}

export function removeDeliberation(driver, { from, to }) {
  const queryParams = {
    fromId: from.nodeId,
    toUrl: to.url,
  };
  const query = `
    MATCH (from {nodeId: {fromId}})-[r:HAS_DELIBERATION]->(to {url: {toUrl}})
    DELETE r
    RETURN from, to
  `;
  return runQueryAndGetRecordWithFields(driver.session(), query, queryParams);
}

export function searchPersons(driver, term) {
  const query = `
    MATCH (p:Person)
    WHERE
      (toLower(p.name) CONTAINS toLower({term}) OR toLower(p.email) CONTAINS toLower({term}))
      AND NOT EXISTS(p.deleted)
    RETURN p
  `;
  return runQueryAndGetRecords(driver.session(), query, { term });
}

export function searchRealities(driver, label, term) {
  const query = `
    MATCH (n:${label})
    WHERE toLower(n.title) CONTAINS toLower({term}) AND NOT EXISTS(n.deleted)
    RETURN n
  `;
  return runQueryAndGetRecords(driver.session(), query, { term });
}

export function getPeopleTwoStepsFromReality(driver, { nodeId }) {
  const query = `
    MATCH (n {nodeId:'${nodeId}'})<-[*0..2]-(p:Person) 
    WITH collect(distinct p) as pe
    UNWIND pe as people
    RETURN people
  `;
  return runQueryAndGetRecords(driver.session(), query, { nodeId });
}

export function getEmailData(driver, { nodeId }) {
  const query = `
    MATCH (n {nodeId:'${nodeId}'})
    MATCH (n)<-[:GUIDES*0..1]-(gu:Person)
    OPTIONAL MATCH (re:Person)-[:REALIZES*0..1]->(n)
    OPTIONAL MATCH (n)-[:FULFILLS]->(need)
    RETURN 
    labels(n) as reality_labels,
    n.description as description, 
    n.title as title, 
    gu.email as guideEmail,
    re.email as realizerEmail,
    need.nodeId as linkedNeedId
  `;
  return runQueryAndGetRawData(driver.session(), query, { nodeId });
}
