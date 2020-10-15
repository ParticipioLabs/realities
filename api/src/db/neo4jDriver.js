import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config({ silent: true });

const driver = neo4j.driver(
  process.env.DB_URL,
  neo4j.auth.basic(
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
  ),
);

// TODO: run migrations here maybe? store "version" in a node with a specific
// label, if that number is too low then run upgrade migrations

// TODO: Run driver.close() when node app exits.

export default driver;
