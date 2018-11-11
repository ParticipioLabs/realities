import uuidv4 from 'uuid/v4';

// runQuery is exported and used in resolvers for the time being
// but should be removed once all resolvers and connectors are refactored.
export function runQuery(session, query, queryParams, f) {
  return session.run(query, queryParams)
    .then((result) => {
      session.close();
      if (f) return f(result);
      if (!result.records) return null;
      if (result.records.length === 1) {
        const singleRecord = result.records[0].get(0);
        return singleRecord.properties;
      }
      return result.records.map(r => r.get(0).properties);
    }).catch((error) => {
      console.log(error);
    });
}

function runQueryAndGetRecords(session, query, params) {
  return session.run(query, params)
    .then((result) => {
      session.close();
      if (!result.records) return null;
      return result.records.map(r => r.get(0).properties);
    });
}

function runQueryAndGetRecord(session, query, params) {
  return runQueryAndGetRecords(session, query, params)
    .then((records) => {
      if (!records || records.length !== 1) return null;
      return records[0];
    });
}

export function findNodesByLabel(driver, label) {
  const query = `
    MATCH (n:${label})
    WHERE NOT EXISTS(n.deleted)
    RETURN n
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
  const relationshipFragment = direction && direction.toUpperCase() === 'IN'
    ? `<-[:${relationship.toUpperCase()}]-`
    : `-[:${relationship.toUpperCase()}]->`;
  return `
    MATCH ({nodeId: {nodeId}})${relationshipFragment}(n:${label})
    WHERE NOT EXISTS(n.deleted)
    RETURN n
  `;
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
