import cron from 'node-cron';
import axios from 'axios';
import { createInfo } from '../graphql/connectors';
import driver from '../db/neo4jDriver';

// TODO: Check encoding, make sure it's UTF-8?
const loomioApi = axios.create({
  baseURL: process.env.LOOMIO_API_BASE,
  timeout: 10000,
  headers: { 'User-Agent': 'Realities Agent', 'Accept-Encoding': 'gzip' },
});

// Set max results to ridiculously high number.
const defaultParams = { per: 100000 };

// Running without Loomio is okay, but suppress the errors.
const checkEnvVars = () => {
  const loomioVars = [
    'LOOMIO_API_BASE',
    'LOOMIO_SITE_BASE',
    'LOOMIO_CRON_SCHEDULE',
  ];
  const errors = [];
  loomioVars.forEach((s) => {
    const v = process.env[s];
    if (typeof v === 'undefined') {
      errors.push(`WARNING: Missing variable "${s}" in .env file`);
    } else if (!v) {
      errors.push(`WARNING: Empty variable "${s}" in .env file`);
    }
  });
  errors.forEach((e) => { console.error(e); });
  return !errors.length;
};

// Loomio resourceName can be either 'discussions' or 'groups'.
// The pathPrefix is 'd' for discussions and 'g' for groups.
// Discussions have titles and groups have names.
// The params are passed through to the axio GET request.
const loomio = async (resourceName, pathPrefix, fieldName, params) => {
  const url = `${resourceName}.json`;
  const allParams = { params };

  console.info(`Getting ${resourceName} from Loomio API`);
  const result = [];
  try {
    const response = await loomioApi.get(url, allParams);
    const objects = response.data[resourceName];
    console.info(`Downloaded ${objects.length} ${resourceName} ${params.since ? `since ${params.since}` : ''}`);

    for (let i = 0; i < objects.length; i += 1) {
      const { key } = objects[i];
      const fieldValue = objects[i][fieldName];
      const objUrl = `${process.env.LOOMIO_SITE_BASE}/${pathPrefix}/${key}`;
      let info = '';
      try {
        /* eslint-disable no-await-in-loop */
        info = await createInfo(driver, { title: fieldValue }, objUrl);
      } catch (err) {
        console.error(err);
      }
      result.push(info.title);
    }
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      // console.log(error.response.data);
      console.error('Response Error status', error.response.status);
      console.error('Response Error headers', error.response.headers);
      console.error('Error', error.message);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.error('Request Error:', error.message);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
  }
  return result;
};

const fetchDiscussions = (params) => {
  if (!checkEnvVars()) { return []; }
  const { resourceName, pathPrefix, fieldName } = {
    resourceName: 'discussions', pathPrefix: 'd', fieldName: 'title',
  };
  const allParams = Object.assign({}, params, defaultParams);
  return loomio(resourceName, pathPrefix, fieldName, allParams);
};
export const initLoomioDiscussions = () => fetchDiscussions({});

const fetchGroups = (params) => {
  if (!checkEnvVars()) { return []; }
  const { resourceName, pathPrefix, fieldName } = {
    resourceName: 'groups', pathPrefix: 'g', fieldName: 'name',
  };
  const allParams = Object.assign(params, defaultParams);
  return loomio(resourceName, pathPrefix, fieldName, allParams);
};
export const initLoomioGroups = () => fetchGroups({});

export const scheduler = () => {
  if (!checkEnvVars()) { return ''; }
  console.info(`Starting Loomio API scheduler: ${process.env.LOOMIO_CRON_SCHEDULE}`);
  const yesterday = new Date(Date.now() - (24 * 3600 * 1000)).toISOString();
  cron.schedule(process.env.LOOMIO_CRON_SCHEDULE, () => {
    fetchDiscussions({ since: yesterday });
    fetchGroups({ since: yesterday });
  });
  return '';
};
