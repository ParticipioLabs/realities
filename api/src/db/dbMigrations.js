/* eslint-disable no-await-in-loop */
import { runQueryAndGetRecord, runQueryAndGetRecords } from './cypherUtils';
import { getCoreModels } from '../services/platoCore';

const currentVersion = 4;

const migrateTo = {
  v2: async () => {
    // create the placeholder org in mongo if it isn't there already

    const coreModels = await getCoreModels();

    const slug = process.env.PLACEHOLDER_ORG_SLUG;
    if (slug === undefined) {
      throw Error('Please set the env var "PLACEHOLDER_ORG_SLUG"');
    }

    const maybeOrg = await coreModels.Organization.findOne({
      subdomain: slug,
    });

    if (maybeOrg !== null) {
      console.log(`Org ${slug} already exists in mongodb, skipping creation`);
      return;
    }
    console.log(`Creating org ${slug} in mongodb`);

    const newOrg = new coreModels.Organization({
      name: slug,
      subdomain: slug,
    });

    await newOrg.save();
  },
  v3: async (driver) => {
    // create an Org node for the placeholder org

    const coreModels = await getCoreModels();

    const slug = process.env.PLACEHOLDER_ORG_SLUG;
    if (slug === undefined) {
      throw Error('Please set the env var "PLACEHOLDER_ORG_SLUG"');
    }

    const theOrg = await coreModels.Organization.findOne({
      subdomain: slug,
    });

    if (theOrg === null) {
      throw Error(`Can't find org ${slug} in core`);
    }

    const query = `
      CREATE (:Org { orgId: $orgId })
    `;
    await runQueryAndGetRecord(driver.session(), query, { orgId: `${theOrg._id}` });
  },
  v4: async (driver) => {
    // add HAS rels between the placeholder org and all (or most) nodes

    const coreModels = await getCoreModels();

    const slug = process.env.PLACEHOLDER_ORG_SLUG;
    if (slug === undefined) {
      throw Error('Please set the env var "PLACEHOLDER_ORG_SLUG"');
    }

    const theOrg = await coreModels.Organization.findOne({
      subdomain: slug,
    });

    if (theOrg === null) {
      throw Error(`Can't find org ${slug} in core`);
    }

    // not doing on ResponsibilityTemplate because we already add the rel every
    // time we make a resp
    // we only want info nodes that are resp text history
    const query = `
      MATCH (org:Org {orgId:$orgId})
      MATCH (n)
        WHERE n:Need OR n:Responsibility OR (n:Info AND EXISTS (n.text))
      MERGE (org)-[:HAS]->(n)
      return n
    `;
    await runQueryAndGetRecords(driver.session(), query, { orgId: `${theOrg._id}` });
  },
};

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
