import path from 'path';
import { makeExecutableSchema } from 'graphql-tools';
import { neo4jgraphql } from 'neo4j-graphql-js';
import express from 'express';
import cors from 'cors';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import neo4jDriver from './db/neo4jDriver';

const typeDefs = `
type Person {
  nodeId: ID!
  name: String
  email: String!
  guidesNeed: [Need] @relation(name: "GUIDES", direction: "OUT")
  realizesNeed: [Need] @relation(name: "REALIZES", direction: "OUT")
  guidesResponsibility: [Responsibility] @relation(name: "GUIDES", direction: "OUT")
  realizesResponsibility: [Responsibility] @relation(name: "REALIZES", direction: "OUT")
}

type NeedResp {
  nodeId: ID!
  title: String!
  description: String
  guide: Person @relation(name: "GUIDES", direction: "IN")
  realizer: Person @relation(name: "REALIZES", direction: "IN")  
}

type Need {
  nodeId: ID!
  title: String!
  description: String
  guide: Person @relation(name: "GUIDES", direction: "IN")
  realizer: Person @relation(name: "REALIZES", direction: "IN")
  fulfilledBy: [Responsibility] @relation(name: "FULFILLS", direction: "IN")
  dependsOnNeeds: [Need] @relation(name: "DEPENDS_ON", direction: "OUT")
  dependsOnResponsibilites: [Responsibility] @relation(name: "DEPENDS_ON", direction: "OUT")
  needsThatDependOnThis: [Need] @relation(name: "DEPENDS_ON", direction: "IN")
  responsibilitiesThatDependOnThis: [Responsibility] @relation(name: "DEPENDS_ON", direction: "IN")
}

type Responsibility {
  nodeId: ID!
  title: String!
  description: String
  guide: Person @relation(name: "GUIDES", direction: "IN")
  realizer: Person @relation(name: "REALIZES", direction: "IN")
  fulfills: Need @relation(name: "FULFILLS", direction:"OUT")
  dependsOnNeeds: [Need] @relation(name: "DEPENDS_ON", direction: "OUT")
  dependsOnResponsibilites: [Responsibility] @relation(name: "DEPENDS_ON", direction: "OUT")
  needsThatDependOnThis: [Need] @relation(name: "DEPENDS_ON", direction: "IN")
  responsibilitiesThatDependOnThis: [Responsibility] @relation(name: "DEPENDS_ON", direction: "IN")
}

type Query {
  persons: [Person]
  responsibilities: [Responsibility]
  needs: [Need]
}

type Mutation {
  createNeed(title: String!): Need 
  createResponsibility(
    title: String!,
    needId: String!
  ): Responsibility 
  updateTitle(
    nodeId: ID!
    title: String!
  ): NeedResp
  updateDescription(
    nodeId: ID!
    description: String!
  ): NeedResp
}

`;

let driver;

const context = (user) => {
  if (!driver) {
    driver = neo4jDriver;
  }
  return {
    driver,
    user,
  };
};

const runQuery = (session, query, queryParams) =>
  session.run(query, queryParams)
    .then((result) => {
      session.close();
      const singleRecord = result.records[0];
      const record = singleRecord.get(0);
      return record.properties;
    }).catch((error) => {
      console.log(error);
    });

const getUserRole = user => user && user['https://realities.theborderland.se/role'];
const getUserEmail = user => user && user['https://realities.theborderland.se/email'];

const resolvers = {
  // root entry point to GraphQL service
  Query: {
    persons(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo);
    },
    responsibilities(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo);
    },
    needs(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo);
    },
  },
  Mutation: {
    createNeed(_, params, ctx) {
      const userRole = getUserRole(ctx.user);
      if (!userRole) {
        throw new Error("User isn't authenticated");
      }
      const queryParams = Object.assign({}, params, { email: getUserEmail(ctx.user) });
      const query = `
        MERGE (person:Person {email:{email}})
        SET person.nodeId = ID(person)
        CREATE (need:Need {title:{title}})
        SET need.nodeId = ID(need)
        CREATE (person)-[:GUIDES]->(need)
        CREATE (person)-[:REALIZES]->(need)
        RETURN need
      `;
      return runQuery(driver.session(), query, queryParams);
    },
    createResponsibility(_, params, ctx) {
      const userRole = getUserRole(ctx.user);
      if (!userRole) {
        throw new Error("User isn't authenticated");
      }
      const queryParams = params;
      const session = driver.session();
      const query = `
        MATCH (need:Need {nodeId: toInteger({needId})} )
        WITH need
        MERGE (resp:Responsibility {title:{title}} )-[r:FULFILLS]->(need)
        WITH resp
        SET resp.nodeId = ID(resp)
        RETURN resp
        `;
      return runQuery(session, query, queryParams);
    },
    updateTitle(_, params, ctx) {
      const userRole = getUserRole(ctx.user);
      if (!userRole) {
        throw new Error("User isn't authenticated");
      }
      const queryParams = params;
      queryParams.nodeId = Number(queryParams.nodeId);
      const session = driver.session();
      const query = `MATCH (n {nodeId: {nodeId}} )
        SET n.title = {title}
        RETURN n`;
      return runQuery(session, query, queryParams);
    },
    updateDescription(_, params, ctx) {
      const userRole = getUserRole(ctx.user);
      if (!userRole) {
        throw new Error("User isn't authenticated");
      }
      const queryParams = params;
      queryParams.nodeId = Number(queryParams.nodeId);
      const session = driver.session();
      const query = `MATCH (n {nodeId: {nodeId}} )
        SET n.description = {description}
        RETURN n`;
      return runQuery(session, query, queryParams);
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const { NODE_ENV, PORT } = process.env;
const API_PORT = NODE_ENV && NODE_ENV.includes('prod') ? PORT || 3000 : 3100;
const app = express();

if (!NODE_ENV || NODE_ENV.includes('dev')) {
  app.use(cors());
}

app.use(jwt({
  credentialsRequired: false,
  // Dynamically provide a signing key based on the kid in the header
  // and the singing keys provided by the JWKS endpoint
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://theborderland.eu.auth0.com/.well-known/jwks.json',
  }),
}));

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlExpress(req => ({
    schema,
    context: context(req.user),
  })),
);

app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// Serve static frontend files.
// NOTE: Temporary solution. Remove this once we deploy static files to its own place
// to decrease coupling between backend and frontend code.
app.use(express.static(path.resolve(__dirname, '../../ui/build')));
app.use((req, res) => res.sendFile(path.resolve(__dirname, '../../ui/build/index.html')));

app.listen(API_PORT, () => {
  console.log(`GraphQL Server is now running on http://localhost:${API_PORT}/graphql`);
  console.log(`View GraphiQL at http://localhost:${API_PORT}/graphiql`);
});
