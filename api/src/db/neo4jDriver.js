import { v1 as neo4j } from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config({ silent: true });

const driver = neo4j.driver(
  process.env.GRAPHENEDB_URL,
  neo4j.auth.basic(
    process.env.GRAPHENEDB_NAME,
    process.env.GRAPHENEDB_KEY,
  ),
);

// TODO: Run driver.close() when node app exits.

export default driver;
