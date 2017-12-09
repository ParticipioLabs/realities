import { v1 as neo4j } from 'neo4j-driver';

const driver = neo4j.driver('bolt://hobby-nfdmkjnckhclgbkeifnhbial.dbs.graphenedb.com:24786', neo4j.auth.basic('realities-dev', 'b.JOosRDbMCr7h.O4fBS2qPIbARuhRo'));

// TODO: Run driver.close() when node app exits.

export default driver;
