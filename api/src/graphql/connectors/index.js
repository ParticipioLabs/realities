import uuidv4 from 'uuid/v4';
import _ from 'lodash';
import {
  runQueryAndGetRecords,
  runQueryAndGetRecord,
  runQueryAndGetRawData,
  runQueryAndGetRecordWithFields,
} from '../../db/cypherUtils';

export async function createConstraints(driver) {
  const queries = [
    { label: 'Org', prop: 'orgId' },
    { label: 'Info', prop: 'nodeId' },
    { label: 'Need', prop: 'nodeId' },
    { label: 'Person', prop: 'nodeId' },
    { label: 'Responsibility', prop: 'nodeId' },
  ]
    .map(c => `
      CREATE CONSTRAINT unique_${c.label.toLowerCase()}_${c.prop.toLowerCase()} IF NOT EXISTS
        ON (n:${c.label}) ASSERT n.${c.prop} IS UNIQUE
    `);

  // eslint-disable-next-line no-restricted-syntax
  for (const query of queries) {
    // eslint-disable-next-line no-await-in-loop
    await runQueryAndGetRecords(driver.session(), query, {});
  }
  console.log('Finished creating constraints');
}

export function findNodesByLabelAnyOrg(driver, label) {
  const query = `
    MATCH (n:${label})
    WHERE NOT EXISTS(n.deleted)
    RETURN n ORDER BY n.created DESC
  `;
  return runQueryAndGetRecords(driver.session(), query, { label });
}

export function findNodesByLabel(driver, label, orgId) {
  const query = `
    MATCH (:Org {orgId:$orgId})-[:HAS]->(n:${label})
    WHERE NOT EXISTS(n.deleted)
    RETURN n ORDER BY n.created DESC
  `;
  return runQueryAndGetRecords(driver.session(), query, { label, orgId });
}

export function findNodeByLabelAndId(driver, label, nodeId) {
  const query = `
    MATCH (n:${label} {nodeId: $nodeId})
    WHERE NOT EXISTS(n.deleted)
    RETURN n
  `;
  return runQueryAndGetRecord(driver.session(), query, { nodeId });
}

export function findNodeByLabelAndProperty(driver, label, propertyKey, propertyValue) {
  const query = `
    MATCH (n:${label} {${propertyKey}: $value})
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

  const rightHandPerson = label === 'Person';

  const query = `
    MATCH (org:Org {orgId:$orgId})
    MATCH ${rightHandPerson ? '(org)-[:HAS]->' : ''}({nodeId: $nodeId})${relationshipFragment}${labelFragment}${rightHandPerson ? '' : '<-[:HAS]-(org)'}
    WHERE NOT EXISTS(n.deleted)
    RETURN n ORDER BY n.created DESC`;
  return query;
}

export function findNodesByRelationshipAndLabel(
  { driver, orgId },
  originNodeId,
  relationship,
  label,
  direction,
) {
  const query = getRelationshipQuery(relationship, label, direction);
  return runQueryAndGetRecords(driver.session(), query, { nodeId: originNodeId, orgId });
}

export function findNodeByRelationshipAndLabel(
  { driver, orgId },
  originNodeId,
  relationship,
  label,
  direction,
) {
  const query = getRelationshipQuery(relationship, label, direction);
  return runQueryAndGetRecord(driver.session(), query, { nodeId: originNodeId, orgId });
}

export function createNeed(driver, { title }, { user, viewedOrg }) {
  const queryParams = {
    title,
    email: user.email,
    orgId: viewedOrg.orgId,
    needId: uuidv4(),
  };
  // Use cypher FOREACH hack to only set nodeId for person if it isn't already set
  const query = `
    MATCH (org:Org {orgId:$orgId})
    MATCH (person:Person {email:$email})
    CREATE (need:Need {title:$title, nodeId:$needId, created:timestamp()})
    CREATE (org)-[:HAS]->(need)
    CREATE (person)-[:GUIDES]->(need)
    RETURN need
  `;
  return runQueryAndGetRecord(driver.session(), query, queryParams);
}

export function createResponsibility(driver, { title, needId }, { email, orgId }) {
  const queryParams = {
    title,
    needId,
    email,
    orgId,
    responsibilityId: uuidv4(),
  };
  // Use cypher FOREACH hack to only set nodeId for person if it isn't already set
  const query = `
    MATCH (org:Org {orgId:$orgId})
    MERGE (n:ResponsibilityTemplate)
    ON CREATE SET n.description = 'Describe the responsibility here'
    MERGE (org)-[:HAS]->(n)
    WITH n.description AS desc
    MATCH (need:Need {nodeId: $needId})
    WITH need, desc
    MATCH (org:Org {orgId:$orgId})
    MATCH (person:Person {email:$email})
    CREATE (resp:Responsibility {
      title:$title,
      description: desc,
      nodeId:$responsibilityId,
      created:timestamp()
    })-[r:FULFILLS]->(need)
    CREATE (person)-[:GUIDES]->(resp)
    CREATE (org)-[:HAS]->(resp)
    RETURN resp
  `;
  return runQueryAndGetRecord(driver.session(), query, queryParams);
}

export function addRespHasDeliberation(driver, { from, to, orgId }) {
  const queryParams = {
    respId: from.nodeId,
    infoUrl: to.url,
    infoId: uuidv4(),
    orgId,
  };
  // Use cypher FOREACH hack to only set nodeId for info if it isn't already set
  const query = `
    MATCH (resp:Responsibility {nodeId: $respId})
    WITH resp
    MERGE (info:Info {url: $infoUrl})
    FOREACH (doThis IN CASE WHEN not(exists(info.nodeId)) THEN [1] ELSE [] END |
      SET info += {nodeId:$infoId, created:timestamp()})
    WITH resp, info
    MATCH (org:Org {orgId:$orgId})
    MERGE (resp)-[:HAS_DELIBERATION]->(info)
    MERGE (org)-[:HAS]->(info)
    RETURN resp as from, info as to
  `;
  return runQueryAndGetRecordWithFields(driver.session(), query, queryParams);
}

export function createOrg(driver, { orgId }) {
  const query = `
    MERGE (org:Org {orgId:$orgId})
    RETURN org
  `;
  return runQueryAndGetRecord(driver.session(), query, { orgId });
}

export async function createViewer({
  user, driver,
}) {
  // idempotently creates user in neo4j
  const queryParams = {
    email: user.email,
    personId: user.userId,
  };
  // nodeId used to be a random uuid, now it's the user's id from keycloak
  // eventually we should probably switch to using this to identify a user
  // instead of their email
  // TODO: for now we'll set the nodeId ON MATCH as well but after every user
  // is likely 'migrated' then we just have to do it ON CREATE
  const query = `
    MERGE (p:Person {email:$email})
    ON MATCH SET
      p.nodeId = $personId
    ON CREATE SET
      p.nodeId = $personId,
      p.created = timestamp()
    return p
  `;
  return runQueryAndGetRecord(driver.session(), query, queryParams);
}

export function updateReality(driver, args, orgId) {
  // Use cypher FOREACH hack to only set realizer
  // if the Person node could be found
  const query = `
    MATCH (org:Org {orgId:$orgId})
    MATCH (reality {nodeId: $nodeId})
    MATCH (oldguide:Person)-[g:GUIDES]->(reality)
    MATCH (guide:Person {email: $guideEmail})
    OPTIONAL MATCH (oldrealizer:Person)-[r:REALIZES]->(reality)
    OPTIONAL MATCH (realizer:Person {email: $realizerEmail})
    FOREACH(doThis IN CASE WHEN NOT $description = reality.description THEN [1] ELSE [] END | 
      CREATE (d:Info {text: reality.description, created: timestamp()})-[:DESCRIBED {created: timestamp()}]->(reality)
      CREATE (org)-[:HAS]->(d)
    )
    FOREACH(doThis IN CASE WHEN NOT oldguide.email = guide.email THEN [1] ELSE [] END | 
      CREATE (oldguide)-[:GUIDED {created: timestamp()}]->(reality)
    )
    FOREACH(doThis IN CASE WHEN NOT oldrealizer.email = realizer.email THEN [1] ELSE [] END | 
      CREATE (oldrealizer)-[:REALIZED {created: timestamp()}]->(reality)
    )
    SET reality += {
      title: $title,
      description: $description
    }
    DELETE g, r
    CREATE (guide)-[:GUIDES]->(reality)
    FOREACH (doThis IN CASE WHEN realizer IS NOT NULL THEN [1] ELSE [] END |
      CREATE (realizer)-[:REALIZES]->(reality))
    RETURN reality
  `;

  // https://github.com/Edgeryders-Participio/realities/issues/160
  const params = _.clone(args);
  params.realizerEmail = params.realizerEmail || '';
  params.orgId = orgId;
  return runQueryAndGetRecord(driver.session(), query, params);
}

export function changeFulfills(driver, { responsibilityId, needId }) {
  const queryParams = {
    responsibilityId,
    needId,
  };

  const query = `
    MATCH (resp:Responsibility {nodeId: $responsibilityId})-[r:FULFILLS]->(n1:Need)
    MATCH (n2:Need {nodeId: $needId})
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
    MERGE (person:Person {email:$email})
    FOREACH (doThis IN CASE WHEN not(exists(person.nodeId)) THEN [1] ELSE [] END |
      SET person += {nodeId:$personId, created:timestamp()})
    SET person.name = $name
    RETURN person
  `;
  return runQueryAndGetRecord(driver.session(), query, queryParams);
}

export function softDeleteNode(driver, { nodeId }) {
  const query = `
    MATCH (n {nodeId: $nodeId})
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
    MATCH (from {nodeId: $fromId})
    MATCH (to {nodeId: $toId})
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
    MATCH (from {nodeId: $fromId})-[r:DEPENDS_ON]->(to {nodeId: $toId})
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
    MATCH (from:Responsibility {nodeId: $fromId})-[r:HAS_DELIBERATION]->(to {url: $toUrl})
    DELETE r
    RETURN from, to
  `;
  return runQueryAndGetRecordWithFields(driver.session(), query, queryParams);
}

export function searchPersons(driver, term) {
  const query = `
    MATCH (p:Person)
    WHERE
      (toLower(p.name) CONTAINS toLower($term) OR toLower(p.email) CONTAINS toLower($term))
      AND NOT EXISTS(p.deleted)
    RETURN p
  `;
  return runQueryAndGetRecords(driver.session(), query, { term });
}

export function searchRealities(driver, label, term, orgId) {
  const query = `
    MATCH (org:Org {orgId:$orgId})
    MATCH (org)-[:HAS]->(n:${label})
    WHERE toLower(n.title) CONTAINS toLower($term) AND NOT EXISTS(n.deleted)
    RETURN n
  `;
  return runQueryAndGetRecords(driver.session(), query, { term, orgId });
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
