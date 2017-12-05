import express from 'express';
import bodyParser from 'body-parser';
import {graphqlExpress, graphiqlExpress} from 'apollo-server-express';
import Schema from './graphql/Schema';

const PORT = 3100;

const app = express();

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: Schema }));
app.get('/graphiql', graphiqlExpress({ endpointURL: '/graphql' })); // Remove this to disable graphiql

app.listen(PORT);
