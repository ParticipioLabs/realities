import neo4j from 'neo4j-driver';
import { runDBMigrations } from './dbMigrations';
import { createConstraints } from '../graphql/connectors';
import { runQueryAndGetRecords } from './cypherUtils';

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function createDriver() {
  const driver = neo4j.driver(
    process.env.DB_URL,
    neo4j.auth.basic(
      process.env.DB_USERNAME,
      process.env.DB_PASSWORD,
    ),
  );

  let connected = false;
  while (!connected) {
    try {
      // running an arbitrary command to see if we actually have a connection
      // to the server. if the server is e.g. not started atm it will throw
      // an exception
      const query = `
        MATCH (n:RealitiesDBVersion)
        return n
      `;
      // eslint-disable-next-line no-await-in-loop
      await runQueryAndGetRecords(driver.session(), query);
      connected = true;
    } catch (err) {
      console.log('Connection to neo4j server failed, trying again');
      // eslint-disable-next-line no-await-in-loop
      await sleep(5000);
    }
  }

  await runDBMigrations(driver);

  await createConstraints(driver);

  return driver;
}

// TODO: Run driver.close() when node app exits.

export default createDriver;
