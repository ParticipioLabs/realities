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
  guidesNeeds: [Need]
    @cypher(
      statement:
        "MATCH (this)-[:GUIDES]->(n:Need) WHERE NOT EXISTS(n.deleted) RETURN n ORDER BY n.created DESC"
    )
  realizesNeeds: [Need]
    @cypher(
      statement:
        "MATCH (this)-[:REALIZES]->(n:Need) WHERE NOT EXISTS(n.deleted) RETURN n ORDER BY n.created DESC"
    )
  guidesResponsibilities: [Responsibility]
    @cypher(
      statement:
        "MATCH (this)-[:GUIDES]->(n:Responsibility) WHERE NOT EXISTS(n.deleted) RETURN n ORDER BY n.created DESC"
    )
  realizesResponsibilities: [Responsibility]
    @cypher(
      statement:
        "MATCH (this)-[:REALIZES]->(n:Responsibility) WHERE NOT EXISTS(n.deleted) RETURN n ORDER BY n.created DESC"
    )
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
  fulfilledBy: [Responsibility]
    @cypher(
      statement:
        "MATCH (this)<-[:FULFILLS]-(n:Responsibility) WHERE NOT EXISTS(n.deleted) RETURN n ORDER BY n.created DESC"
    )
  dependsOnNeeds: [Need]
    @cypher(
      statement:
        "MATCH (this)-[:DEPENDS_ON]->(n:Need) WHERE NOT EXISTS(n.deleted) RETURN n ORDER BY n.created DESC"
    )
  dependsOnResponsibilities: [Responsibility]
    @cypher(
      statement:
        "MATCH (this)-[:DEPENDS_ON]->(n:Responsibility) WHERE NOT EXISTS(n.deleted) RETURN n ORDER BY n.created DESC"
    )
  needsThatDependOnThis: [Need]
    @cypher(
      statement:
        "MATCH (this)<-[:DEPENDS_ON]-(n:Need) WHERE NOT EXISTS(n.deleted) RETURN n ORDER BY n.created DESC"
    )
  responsibilitiesThatDependOnThis: [Responsibility]
    @cypher(
      statement:
        "MATCH (this)<-[:DEPENDS_ON]-(n:Responsibility) WHERE NOT EXISTS(n.deleted) RETURN n ORDER BY n.created DESC"
    )
}

type Responsibility {
  nodeId: ID!
  title: String!
  description: String
  deliberationLink: String
  created: String
  deleted: String
  guide: Person @relation(name: "GUIDES", direction: "IN")
  realizer: Person @relation(name: "REALIZES", direction: "IN")
  fulfills: Need @relation(name: "FULFILLS", direction:"OUT")
  dependsOnNeeds: [Need]
    @cypher(
      statement:
        "MATCH (this)-[:DEPENDS_ON]->(n:Need) WHERE NOT EXISTS(n.deleted) RETURN n ORDER BY n.created DESC"
    )
  dependsOnResponsibilities: [Responsibility]
    @cypher(
      statement:
        "MATCH (this)-[:DEPENDS_ON]->(n:Responsibility) WHERE NOT EXISTS(n.deleted) RETURN n ORDER BY n.created DESC"
    )
  needsThatDependOnThis: [Need]
    @cypher(
      statement:
        "MATCH (this)<-[:DEPENDS_ON]-(n:Need) WHERE NOT EXISTS(n.deleted) RETURN n ORDER BY n.created DESC"
    )
  responsibilitiesThatDependOnThis: [Responsibility]
    @cypher(
      statement:
        "MATCH (this)<-[:DEPENDS_ON]-(n:Responsibility) WHERE NOT EXISTS(n.deleted) RETURN n ORDER BY n.created DESC"
    )
}

input _NeedInput {
  nodeId: ID!
}

input _ResponsibilityInput {
  nodeId: ID!
}

type SearchNeedsAndResponsibilitiesResult {
  needs: [Need]
  responsibilities: [Responsibility]
}

type _SearchPersonsPayload {
  persons: [Person]
}

type _NeedDependsOnNeedsPayload {
  from: Need
  to: Need
}

type _NeedDependsOnResponsibilitiesPayload {
  from: Need
  to: Responsibility
}

type _ResponsibilityDependsOnNeedsPayload {
  from: Responsibility
  to: Need
}

type _ResponsibilityDependsOnResponsibilitiesPayload {
  from: Responsibility
  to: Responsibility
}

type Query {
  persons: [Person]
  needs: [Need]
    @cypher(
      statement: "MATCH (n:Need) WHERE NOT EXISTS(n.deleted) RETURN n ORDER BY n.created DESC"
    )
  need(nodeId: ID!, deleted: String): Need
  responsibilities: [Responsibility]
    @cypher(
      statement: 
        "MATCH (n:Responsibility) WHERE NOT EXISTS(n.deleted) RETURN n ORDER BY n.created DESC"
    )
  responsibility(nodeId: ID!, deleted: String): Responsibility
  searchNeedsAndResponsibilities(term: String!): SearchNeedsAndResponsibilitiesResult
  searchPersons(term: String!): _SearchPersonsPayload
}

type Mutation {
  createNeed(title: String!): Need
  createResponsibility(
    title: String!
    needId: ID!
  ): Responsibility 
  updateNeed(
    nodeId: ID!
    title: String!
    guideEmail: String!
    realizerEmail: String
    description: String
    deliberationLink: String
  ): Need
  updateResponsibility(
    nodeId: ID!
    title: String!
    guideEmail: String!
    realizerEmail: String
    description: String
    deliberationLink: String
  ): Responsibility
  softDeleteNeed(nodeId: ID!): Need
  softDeleteResponsibility(nodeId: ID!): Responsibility
  addNeedDependsOnNeeds(
    from: _NeedInput!
    to: _NeedInput!
  ): _NeedDependsOnNeedsPayload
  addNeedDependsOnResponsibilities(
    from: _NeedInput!
    to: _ResponsibilityInput!
  ): _NeedDependsOnResponsibilitiesPayload
  addResponsibilityDependsOnNeeds(
    from: _ResponsibilityInput!
    to: _NeedInput!
  ): _ResponsibilityDependsOnNeedsPayload
  addResponsibilityDependsOnResponsibilities(
    from: _ResponsibilityInput!
    to: _ResponsibilityInput!
  ): _ResponsibilityDependsOnResponsibilitiesPayload
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
    searchNeedsAndResponsibilities(object, params) {
      // This could (and should) be replaced with a "filter" argument on the needs
      // and responsibilities fields once neo4j-graphql-js supports that
      const query = `
        MATCH (n)
        WHERE
          (n:Need OR n:Responsibility)
          AND toLower(n.title) CONTAINS toLower({term})
          AND NOT EXISTS(n.deleted)
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
    searchPersons(object, params) {
      // This could (and should) be replaced with a "filter" argument
      // on the persons field once neo4j-graphql-js supports that
      const query = `
        MATCH (p:Person)
        WHERE
          (toLower(p.name) CONTAINS toLower({term}) OR toLower(p.email) CONTAINS toLower({term}))
          AND NOT EXISTS(p.deleted)
        RETURN p
      `;
      return runQuery(driver.session(), query, params, result => ({
        persons: result.records.map(r => r.get(0).properties),
      }));
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
      // Use cypher FOREACH hack to only set realizer
      // if the Person node could be found
      const query = `
        MATCH (need:Need {nodeId: {nodeId}})
        MATCH (:Person)-[g:GUIDES]->(need)
        MATCH (guide:Person {email: {guideEmail}})
        OPTIONAL MATCH (:Person)-[r:REALIZES]->(need)
        OPTIONAL MATCH (realizer:Person {email: {realizerEmail}})
        SET need += {
          title: {title},
          description: {description},
          deliberationLink: {deliberationLink}
        }
        DELETE g, r
        CREATE (guide)-[:GUIDES]->(need)
        FOREACH (doThis IN CASE WHEN realizer IS NOT NULL THEN [1] ELSE [] END |
          CREATE (realizer)-[:REALIZES]->(need))
        RETURN need, guide, realizer
      `;
      return runQuery(driver.session(), query, params, (result) => {
        const need = result.records[0].get('need');
        const guide = result.records[0].get('guide');
        const realizer = result.records[0].get('realizer');
        return Object.assign(
          {},
          need.properties,
          {
            guide: guide && guide.properties,
            realizer: realizer && realizer.properties,
          },
        );
      });
    },
    updateResponsibility(_, params, ctx) {
      const userRole = getUserRole(ctx.user);
      if (!userRole) {
        // Here we should check if the user has permission
        // to edit this particular responsibility
        throw new Error("User isn't authenticated");
      }
      // Use cypher FOREACH hack to only set realizer
      // if the Person node could be found
      const query = `
        MATCH (resp:Responsibility {nodeId: {nodeId}})
        MATCH (:Person)-[g:GUIDES]->(resp)
        MATCH (guide:Person {email: {guideEmail}})
        OPTIONAL MATCH (realizer:Person {email: {realizerEmail}})
        OPTIONAL MATCH (:Person)-[r:REALIZES]->(resp)
        SET resp += {
          title: {title},
          description: {description},
          deliberationLink: {deliberationLink}
        }
        DELETE g, r
        CREATE (guide)-[:GUIDES]->(resp)
        FOREACH (doThis IN CASE WHEN realizer IS NOT NULL THEN [1] ELSE [] END |
          CREATE (realizer)-[:REALIZES]->(resp))
        RETURN resp, guide, realizer
      `;
      return runQuery(driver.session(), query, params, (result) => {
        const resp = result.records[0].get('resp');
        const guide = result.records[0].get('guide');
        const realizer = result.records[0].get('realizer');
        return Object.assign(
          {},
          resp.properties,
          {
            guide: guide && guide.properties,
            realizer: realizer && realizer.properties,
          },
        );
      });
    },
    softDeleteNeed(_, params, ctx) {
      const userRole = getUserRole(ctx.user);
      if (!userRole) {
        throw new Error("User isn't authenticated");
      }
      // Here we should check if the user has permission
      // to soft delete this particular need and if the need
      // is free of responsibilities and dependents
      const query = `
        MATCH (need:Need {nodeId: {nodeId}})
        SET need.deleted = timestamp()
        RETURN need
      `;
      return runQuery(driver.session(), query, params);
    },
    softDeleteResponsibility(_, params, ctx) {
      const userRole = getUserRole(ctx.user);
      if (!userRole) {
        throw new Error("User isn't authenticated");
      }
      // Here we should check if the user has permission
      // to soft delete this particular responsibility and
      // if it is free of dependents
      const query = `
        MATCH (resp:Responsibility {nodeId: {nodeId}})-[:FULFILLS]->(need:Need)
        SET resp.deleted = timestamp()
        RETURN resp, need
      `;
      return runQuery(driver.session(), query, params, result => Object.assign(
        {},
        result.records[0].get('resp').properties,
        { fulfills: result.records[0].get('need').properties },
      ));
    },
    addNeedDependsOnNeeds(_, params, ctx) {
      // This could probably be replaced if neo4j-graphql-js develops better support
      // for mutating relationships. Right now they require relationships to be
      // defined with the @relation directive, which we can't use because we have to
      // filter soft-deleted nodes in our relations in the schema.
      const userRole = getUserRole(ctx.user);
      if (!userRole) {
        throw new Error("User isn't authenticated");
      }
      const queryParams = {
        fromId: params.from.nodeId,
        toId: params.to.nodeId,
      };
      const query = `
        MATCH (fromNeed:Need {nodeId: {fromId}})
        MATCH (toNeed:Need {nodeId: {toId}})
        MERGE (fromNeed)-[:DEPENDS_ON]->(toNeed)
        WITH fromNeed, toNeed
        MATCH (fromNeed)-[:DEPENDS_ON]->(dependency:Need)
        WHERE NOT EXISTS(dependency.deleted)
        RETURN fromNeed, toNeed, dependency
        ORDER BY dependency.created DESC
      `;
      return runQuery(driver.session(), query, queryParams, (result) => {
        const fromNeed = result.records[0].get('fromNeed').properties;
        const toNeed = result.records[0].get('toNeed').properties;
        const dependencies = result.records.map(r => r.get('dependency').properties);
        return {
          from: Object.assign({}, fromNeed, { dependsOnNeeds: dependencies }),
          to: toNeed,
        };
      });
    },
    addNeedDependsOnResponsibilities(_, params, ctx) {
      const userRole = getUserRole(ctx.user);
      if (!userRole) {
        throw new Error("User isn't authenticated");
      }
      const queryParams = {
        fromId: params.from.nodeId,
        toId: params.to.nodeId,
      };
      const query = `
        MATCH (fromNeed:Need {nodeId: {fromId}})
        MATCH (toResp:Responsibility {nodeId: {toId}})
        MERGE (fromNeed)-[:DEPENDS_ON]->(toResp)
        WITH fromNeed, toResp
        MATCH (fromNeed)-[:DEPENDS_ON]->(dependency:Responsibility)
        MATCH (dependency)-[:FULFILLS]->(fulfills:Need)
        WHERE NOT EXISTS(dependency.deleted)
        RETURN fromNeed, toResp, dependency, fulfills
        ORDER BY dependency.created DESC
      `;
      return runQuery(driver.session(), query, queryParams, (result) => {
        const fromNeed = result.records[0].get('fromNeed').properties;
        const toResp = result.records[0].get('toResp').properties;
        const dependencies = result.records.map(r => Object.assign(
          {},
          r.get('dependency').properties,
          { fulfills: r.get('fulfills').properties },
        ));
        return {
          from: Object.assign({}, fromNeed, { dependsOnResponsibilities: dependencies }),
          to: toResp,
        };
      });
    },
    addResponsibilityDependsOnNeeds(_, params, ctx) {
      const userRole = getUserRole(ctx.user);
      if (!userRole) {
        throw new Error("User isn't authenticated");
      }
      const queryParams = {
        fromId: params.from.nodeId,
        toId: params.to.nodeId,
      };
      const query = `
        MATCH (fromResp:Responsibility {nodeId: {fromId}})
        MATCH (toNeed:Need {nodeId: {toId}})
        MERGE (fromResp)-[:DEPENDS_ON]->(toNeed)
        WITH fromResp, toNeed
        MATCH (fromResp)-[:DEPENDS_ON]->(dependency:Need)
        WHERE NOT EXISTS(dependency.deleted)
        RETURN fromResp, toNeed, dependency
        ORDER BY dependency.created DESC
      `;
      return runQuery(driver.session(), query, queryParams, (result) => {
        const fromResp = result.records[0].get('fromResp').properties;
        const toNeed = result.records[0].get('toNeed').properties;
        const dependencies = result.records.map(r => r.get('dependency').properties);
        return {
          from: Object.assign({}, fromResp, { dependsOnNeeds: dependencies }),
          to: toNeed,
        };
      });
    },
    addResponsibilityDependsOnResponsibilities(_, params, ctx) {
      const userRole = getUserRole(ctx.user);
      if (!userRole) {
        throw new Error("User isn't authenticated");
      }
      const queryParams = {
        fromId: params.from.nodeId,
        toId: params.to.nodeId,
      };
      const query = `
        MATCH (fromResp:Responsibility {nodeId: {fromId}})
        MATCH (toResp:Responsibility {nodeId: {toId}})
        MERGE (fromResp)-[:DEPENDS_ON]->(toResp)
        WITH fromResp, toResp
        MATCH (fromResp)-[:DEPENDS_ON]->(dependency:Responsibility)
        MATCH (dependency)-[:FULFILLS]->(fulfills:Need)
        WHERE NOT EXISTS(dependency.deleted)
        RETURN fromResp, toResp, dependency, fulfills
        ORDER BY dependency.created DESC
      `;
      return runQuery(driver.session(), query, queryParams, (result) => {
        const fromResp = result.records[0].get('fromResp').properties;
        const toResp = result.records[0].get('toResp').properties;
        const dependencies = result.records.map(r => Object.assign(
          {},
          r.get('dependency').properties,
          { fulfills: r.get('fulfills').properties },
        ));
        return {
          from: Object.assign({}, fromResp, { dependsOnResponsibilities: dependencies }),
          to: toResp,
        };
      });
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
