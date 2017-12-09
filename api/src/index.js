import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import Schema from './graphql/Schema';
import neo4jDriver from './db/neo4jDriver';

const PORT = 3100;

const app = express();

app.use('/graphql', bodyParser.json(), graphqlExpress(() => ({
  schema: Schema,
  context: {
    neo4jSession: neo4jDriver.session(),
  },
})));
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' })); // Remove this to disable graphiql

app.listen(PORT, () => {
  console.log(`API ready on port ${PORT}`);
});
