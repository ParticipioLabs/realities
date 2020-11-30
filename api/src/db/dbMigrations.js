import { runQueryAndGetRecord } from './cypherUtils';

const currentVersion = 1;

// eslint-disable-next-line import/prefer-default-export
export async function runDBMigrations(driver) {
  console.log('Running migrations');
  // not actually running migrations yet :PPppPpPpPp

  const query = `
    MERGE (n:RealitiesDBVersion)
    ON CREATE SET n.version = '${currentVersion}'
    return n
  `;
  const res = await runQueryAndGetRecord(driver.session(), query);
  const dbVersion = Number(res.version);
  console.log('db version', dbVersion);
}
