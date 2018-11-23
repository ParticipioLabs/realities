// import dotenv from 'dotenv';
import axios from 'axios';
import { createInfo } from '../graphql/connectors';
import driver from '../db/neo4jDriver';

const loomioApi = axios.create({
  baseURL: process.env.LOOMIO_API_BASE,
  timeout: 10000,
  headers: { 'User-Agent': 'realities', 'Accept-Encoding': 'gzip' },
});

// For Loomio resourceType can be either 'discussions' or 'groups'
const loomio = (resourceType) => {
  const url = `${resourceType}.json`;
  // Conveniently, the prefix happens to be the first letter of the resourceType.
  const pathPrefix = resourceType[0];

  loomioApi.get(url)
    .then((response) => {
      const { discussions } = response.data;
      discussions.forEach((discussion) => {
        const { key, title } = discussion;
        const discussionUrl = `${process.env.LOOMIO_SITE_BASE}/${pathPrefix}/${key}`;
        // console.log(title, discussionUrl);
        try {
          createInfo(driver, { title }, discussionUrl);
        } catch (e) {
          console.log(e);
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export default loomio;
