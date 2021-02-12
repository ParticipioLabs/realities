import { runQueryAndGetRecord, runQueryAndGetRecords } from '../cypherUtils';
import { getCoreModels } from '../../services/platoCore';

// eslint-disable-next-line import/prefer-default-export
export const migrateTo = {
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
  v5: async (driver) => {
    // deletes undeleted resps belonging to deleted needs
    const query = `
    MATCH (n:Need)<-[:FULFILLS]-(r:Responsibility)
    WHERE EXISTS (n.deleted)
      AND NOT EXISTS (r.deleted)
    SET r.deleted=timestamp()
    RETURN r
    `;
    await runQueryAndGetRecords(driver.session(), query, {});
  },
  v6: async (driver) => {
    // removes all deliberationLink properties on needs and resps since they're
    // in practice always empty strings. this feature has been moved into being
    // stored on a separate Info node instead
    const query = `
    MATCH (n) WHERE EXISTS(n.deliberationLink) REMOVE n.deliberationLink RETURN n LIMIT 25
    `;
    await runQueryAndGetRecords(driver.session(), query, {});
  },
  v7: async (driver) => {
    const query = `
    MATCH (:Need)-[d:DEPENDS_ON]-() DELETE d
    `;
    await runQueryAndGetRecords(driver.session(), query, {});
  },
};
