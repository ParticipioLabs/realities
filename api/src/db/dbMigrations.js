/* eslint-disable no-await-in-loop */
import { runQueryAndGetRecord } from './cypherUtils';
import { migrateTo } from './migrations/';

const currentVersion = 6;

async function getDBVersion(driver) {
  // this also inits the RealitiesDBVersion node
  const query = `
    MERGE (n:RealitiesDBVersion)
    ON CREATE SET n.version = '${currentVersion}'
    return n
  `;
  const res = await runQueryAndGetRecord(driver.session(), query);
  return Number(res.version);
}

async function setDBVersion(driver, version) {
  const query = `
    MATCH (n:RealitiesDBVersion)
    SET n.version = '${version}'
    return n
  `;
  const res = await runQueryAndGetRecord(driver.session(), query);
  if (Number(res.version) !== version) {
    throw Error('Setting version failed');
  }
}

// eslint-disable-next-line import/prefer-default-export
export async function runDBMigrations(driver) {
  let dbVersion = await getDBVersion(driver);
  console.log('db version', dbVersion);


  if (dbVersion < currentVersion) {
    console.log(`Your database is version ${dbVersion} but you're running a Realities version that requires a database with version ${currentVersion}. Running migrations.`);
  } else if (dbVersion > currentVersion) {
    throw Error(`Your database is version ${dbVersion} but you're running a Realities version that requires a database with version ${currentVersion}. This probably means that you've downgraded to an older version of Realities and that it is incompatible with your database. Please upgrade to a newer version of Realities. Aborting.`);
  }

  while (dbVersion < currentVersion) {
    console.log(`Performing migration to database version ${dbVersion + 1}`);
    await migrateTo[`v${dbVersion + 1}`](driver);
    console.log(`Successfully migrated db to version ${dbVersion + 1}`);

    dbVersion += 1;
    await setDBVersion(driver, dbVersion);
  }
}
