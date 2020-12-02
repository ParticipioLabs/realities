import _ from 'lodash';

// This fist connector works differently than the rest.
// It does not get Nodes, but data records that can be from a calculation.
// Because of this, it does not assign a __label propery.
export async function runQueryAndGetRawData(session, query, params) {
  return session.run(query, params)
    .then((result) => {
      session.close();
      if (!result.records) return null;
      return result.records[0].toObject();
    });
}

export async function runQueryAndGetRecords(session, query, params) {
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

export async function runQueryAndGetRecord(session, query, params) {
  return runQueryAndGetRecords(session, query, params)
    .then((records) => {
      if (!records || records.length !== 1) return null;
      return records[0];
    });
}

export async function runQueryAndGetRecordsWithFields(session, query, params) {
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

export async function runQueryAndGetRecordWithFields(session, query, params) {
  return runQueryAndGetRecordsWithFields(session, query, params)
    .then((records) => {
      if (!records || records.length !== 1) return null;
      return records[0];
    });
}
