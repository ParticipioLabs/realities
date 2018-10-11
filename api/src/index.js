import path from 'path';
import { makeExecutableSchema } from 'graphql-tools';
import { neo4jgraphql } from 'neo4j-graphql-js';
import express from 'express';
import cors from 'cors';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import bodyParser from 'body-parser';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import uuidv4 from 'uuid/v4';
import neo4jDriver from './db/neo4jDriver';

const typeDefs = `
type Person {
  nodeId: ID!
  name: String
  email: String!
  created: String
  guidesNeeds: [Need] @relation(name: "GUIDES", direction: "OUT")
  realizesNeeds: [Need] @relation(name: "REALIZES", direction: "OUT")
  guidesResponsibilities: [Responsibility] @relation(name: "GUIDES", direction: "OUT")
  realizesResponsibilities: [Responsibility] @relation(name: "REALIZES", direction: "OUT")
}

type Need {
  nodeId: ID!
  title: String!
  description: String
  deliberationLink: String
  created: String
  deleted: String
  guide: Person @relation(name: "GUIDES", direction: "IN")
  realizer: Person @relation(name: "REALIZES", direction: "IN")
  fulfilledBy: [Responsibility] @relation(name: "FULFILLS", direction: "IN")
  dependsOnNeeds: [Need] @relation(name: "DEPENDS_ON", direction: "OUT")
  dependsOnResponsibilities: [Responsibility] @relation(name: "DEPENDS_ON", direction: "OUT")
  needsThatDependOnThis: [Need] @relation(name: "DEPENDS_ON", direction: "IN")
  responsibilitiesThatDependOnThis: [Responsibility] @relation(name: "DEPENDS_ON", direction: "IN")
}

type Responsibility {
  nodeId: ID!
  title: String!
  description: String
  deliberationLink: String
  created: String
  guide: Person @relation(name: "GUIDES", direction: "IN")
  realizer: Person @relation(name: "REALIZES", direction: "IN")
  fulfills: Need @relation(name: "FULFILLS", direction:"OUT")
  dependsOnNeeds: [Need] @relation(name: "DEPENDS_ON", direction: "OUT")
  dependsOnResponsibilities: [Responsibility] @relation(name: "DEPENDS_ON", direction: "OUT")
  needsThatDependOnThis: [Need] @relation(name: "DEPENDS_ON", direction: "IN")
  responsibilitiesThatDependOnThis: [Responsibility] @relation(name: "DEPENDS_ON", direction: "IN")
}

type SearchResult {
  needs: [Need]
  responsibilities: [Responsibility]
}

type Query {
  persons: [Person]
  needs: [Need]
  need(nodeId: ID!): Need
  responsibilities: [Responsibility]
  responsibility(nodeId: ID!): Responsibility
  search(term: String!): SearchResult
}

type Mutation {
  createNeed(title: String!): Need 
  createResponsibility(
    title: String!,
    needId: ID!
  ): Responsibility 
  updateNeed(
    nodeId: ID!
    title: String!
    description: String
    deliberationLink: String
  ): Need
  updateResponsibility(
    nodeId: ID!
    title: String!
    description: String
    deliberationLink: String
  ): Responsibility
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

const runQuery = (session, query, queryParams, f) =>
  session.run(query, queryParams)
    .then((result) => {
      session.close();
      if (f) return f(result);
      if (!result.records) return null;
      if (result.records.length === 1) {
        const singleRecord = result.records[0].get(0);
        return singleRecord.properties;
      }
      return result.records.map(r => r.get(0).properties);
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
    needs(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo);
    },
    need(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo);
    },
    responsibilities(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo);
    },
    responsibility(object, params, ctx, resolveInfo) {
      return neo4jgraphql(object, params, ctx, resolveInfo);
    },
    search(object, params) {
      // This could (and should) be replaced with a "filter" argument on the needs
      // and responsibilities fields once neo4j-graphql-js supports that
      const query = `
        MATCH (n)
        WHERE (n:Need OR n:Responsibility) AND toLower(n.title) CONTAINS toLower({term})
        OPTIONAL MATCH (n)-[:FULFILLS]->(f:Need)
        RETURN n, f
      `;
      return runQuery(driver.session(), query, params, (result) => {
        const records = result.records.map(r => ({
          node: r.get('n'),
          fulfills: r.get('f'),
        }));
        const needs = records
          .filter(r => r.node.labels[0] === 'Need')
          .map(r => r.node.properties);
        const responsibilities = records
          .filter(r => r.node.labels[0] === 'Responsibility')
          .map(r => Object.assign({}, r.node.properties, { fulfills: r.fulfills.properties }));
        return { needs, responsibilities };
      });
    },
  },
  Mutation: {
    createNeed(_, params, ctx) {
      const userRole = getUserRole(ctx.user);
      if (!userRole) {
        throw new Error("User isn't authenticated");
      }
      const queryParams = Object.assign(
        {},
        params,
        {
          email: getUserEmail(ctx.user),
          personId: uuidv4(),
          needId: uuidv4(),
        },
      );
      // Use cypher FOREACH hack to only set nodeId for person if it isn't already set
      const query = `
        MERGE (person:Person {email:{email}})
        FOREACH (doThis IN CASE WHEN not(exists(person.nodeId)) THEN [1] ELSE [] END |
          SET person += {nodeId:{personId}, created:timestamp()})
        CREATE (need:Need {title:{title}, nodeId:{needId}, created:timestamp()})
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
      const queryParams = Object.assign(
        {},
        params,
        {
          email: getUserEmail(ctx.user),
          personId: uuidv4(),
          responsibilityId: uuidv4(),
        },
      );
      // Use cypher FOREACH hack to only set nodeId for person if it isn't already set
      const query = `
        MATCH (need:Need {nodeId: {needId}})
        WITH need
        MERGE (person:Person {email:{email}})
        FOREACH (doThis IN CASE WHEN not(exists(person.nodeId)) THEN [1] ELSE [] END |
          SET person += {nodeId:{personId}, created:timestamp()})
        CREATE (resp:Responsibility {
          title:{title},
          nodeId:{responsibilityId},
          created:timestamp()
        })-[r:FULFILLS]->(need)
        CREATE (person)-[:GUIDES]->(resp)
        RETURN resp
      `;
      return runQuery(driver.session(), query, queryParams);
    },
    updateNeed(_, params, ctx) {
      const userRole = getUserRole(ctx.user);
      if (!userRole) {
        // Here we should check if the user has permission
        // to edit this particular need
        throw new Error("User isn't authenticated");
      }
      const query = `
        MATCH (need:Need {nodeId: {nodeId}})
        SET need += {
          title: {title},
          description: {description},
          deliberationLink: {deliberationLink}
        }
        RETURN need
      `;
      return runQuery(driver.session(), query, params);
    },
    updateResponsibility(_, params, ctx) {
      const userRole = getUserRole(ctx.user);
      if (!userRole) {
        // Here we should check if the user has permission
        // to edit this particular responsibility
        throw new Error("User isn't authenticated");
      }
      const query = `
        MATCH (resp:Responsibility {nodeId: {nodeId}})
        SET resp += {
          title: {title},
          description: {description},
          deliberationLink: {deliberationLink}
        }
        RETURN resp
      `;
      return runQuery(driver.session(), query, params);
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
