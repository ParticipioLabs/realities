import cron from 'node-cron';
import axios from 'axios';
import { createInfo } from '../graphql/connectors';
import driver from '../db/neo4jDriver';

const loomioApi = axios.create({
  baseURL: process.env.LOOMIO_API_BASE,
  timeout: 10000,
  headers: { 'User-Agent': 'Realities Agent', 'Accept-Encoding': 'gzip' },
});

// Set max number of results to ridiculously high number.
const defaultParams = { params: { per: 100000 } };

// Running without Loomio is okay, but suppress the errors.
const checkEnvVars = () => {
  const valid = (
    process.env.LOOMIO_API_BASE &&
    process.env.LOOMIO_SITE_BASE &&
    process.env.LOOMIO_CRON_SCHEDULE
  );
  if (!valid) {
    console.log('ERROR: Missing LOOMIO vars in .env file');
    return false;
  }
  return valid;
};

// For Loomio resourceType can be either 'discussions' or 'groups'
export const loomio = (resourceType) => {
  if (!checkEnvVars()) { return 'ERROR: Missing LOOMIO vars in .env file'; }
  const url = `${resourceType}.json`;
  // Conveniently, the prefix happens to be the first letter of the resourceType.
  const pathPrefix = resourceType[0];
  console.log(`Getting ${resourceType} from Loomio API`);

  loomioApi.get(url, defaultParams)
    .then((response) => {
      const { discussions: objects } = response.data;
      console.log(`Downloaded ${objects.length} ${resourceType}`);
      objects.forEach((obj) => {
        const { key, title } = obj;
        const objUrl = `${process.env.LOOMIO_SITE_BASE}/${pathPrefix}/${key}`;
        // console.log(title, discussionUrl);
        try {
          createInfo(driver, { title }, objUrl);
        } catch (e) {
          console.log(e);
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
  return true;
};

export const scheduler = () => {
  if (!checkEnvVars()) { return; }
  console.log(`Starting Loomio API scheduler: ${process.env.LOOMIO_CRON_SCHEDULE}`);
  cron.schedule(process.env.LOOMIO_CRON_SCHEDULE, () => {
    loomio('discussions');
  });
};
