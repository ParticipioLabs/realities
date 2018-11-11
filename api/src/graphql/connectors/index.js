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

function getRecords(session, query, params) {
  return session.run(query, params)
    .then((result) => {
      session.close();
      if (!result.records) return null;
      return result.records.map(r => r.get(0).properties);
    });
}

function getRecord(session, query, params) {
  return session.run(query, params)
    .then((result) => {
      session.close();
      if (result.records && result.records.length === 1) {
        const singleRecord = result.records[0].get(0);
        return singleRecord.properties;
      }
      return null;
    });
}

export function findNodesByLabel(driver, label) {
  const query = `
    MATCH (n:${label})
    WHERE NOT EXISTS(n.deleted)
    RETURN n
  `;
  return getRecords(driver.session(), query, { label });
}

export function findNodeByLabelAndId(driver, label, nodeId) {
  const query = `
    MATCH (n:${label} {nodeId: {nodeId}})
    WHERE NOT EXISTS(n.deleted)
    RETURN n
  `;
  return getRecord(driver.session(), query, { nodeId });
}

export function findNodeByLabelAndProperty(driver, label, propertyKey, propertyValue) {
  const query = `
    MATCH (n:${label} {${propertyKey}: {value}})
    WHERE NOT EXISTS(n.deleted)
    RETURN n
  `;
  return getRecord(driver.session(), query, { value: propertyValue });
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
  return getRecords(driver.session(), query, { nodeId: originNodeId });
}

export function findNodeByRelationshipAndLabel(
  driver,
  originNodeId,
  relationship,
  label,
  direction,
) {
  const query = getRelationshipQuery(relationship, label, direction);
  return getRecord(driver.session(), query, { nodeId: originNodeId });
}
