# Realities Back-end

The Realities back-end is a simple Node.js service that exposes a GraphQL API via a /graphql endpoint. It reads and stores data in a Neo4j graph database. 

## How to contribute

Most of the back-end code is in a single index.js file right now. That needs to be changed as the complexity of the back-end grows. The index file defines the GraphQL schema and GraphQL resolvers, and sets up the GraphQL endpoint using [express](https://expressjs.com/) and [graphql-server-express](https://www.npmjs.com/package/graphql-server-express). It also uses the [express-jwt](https://github.com/auth0/express-jwt) middleware to validate and parse the [Json Web Token (JWT)](https://jwt.io/) sent as an authentication header in every request from the front-end when the user is logged in.

### Authentication with Auth0

When the user is logged in, they send a JWT in an authentication header with every request. The JWT is validated and parsed using the [express-jwt](https://github.com/auth0/express-jwt) middleware. When we use [graphql-server-express](https://www.npmjs.com/package/graphql-server-express) to set up the GraphQL endpoint, the parsed JWT is made available to our GraphQL resolvers in a `user` property on their [context argument](https://graphql.org/graphql-js/graphql/#graphql). We then have a couple of helper functions (`getUserRole` and `getUserEmail`) defined in the file that help get the user's email and role from the user object. The user's email and role can then be used in the resolver to determine whether they have access to do whatever they're trying to do. If they don't an error with a message should be thrown and GraphQL will take care of sending an appropriate error response to the front-end.

We've set up custom [rules in Auth0](https://auth0.com/docs/rules/current) that add the user's email and role to the JWT when the user logs in. The user's role is either `'user'` (if they're a regular user) or `'admin'` (if they're a realities admin). To make a user a realities admin, log into Auth0, look them up under 'Users' and add the following to their `app_metadata`: 

```
{
  "role": "admin"
}
```

### Neo4j/GraphQL schema

Neo4j doesn't really have a fixed schema, but we have an implicit schema that is also codified in the GraphQL schema. The GraphQL schema is defined at the top of the back-end's `index.js` file. 

We have three main types in our schema, namely `Person`, `Need` and `Responsibliity`. Each of these have their own properties that are somewhat self-explanatory. Some notable properties that might not be self-explanatory are: 

- `nodeId`: Neo4j's native ID's are semantic. They're basically just an integer that gets incremented every time you create a node. They start counting from the highest current ID number. This creates a few problems if we try to use Neo4j's native IDs as UUIDs throughout the system. For example, we use a need's UUID in the URL on the front-end to keep track of which need is selected in the UI. That means that people can send each other links to a specific need. If you remove a need in Neo4j and create a new one, the new need might end up getting the same ID as the old one you created. That's not ideal. Instead of using Neo4j's native ID to identify nodes, we generate our own [UUID v4](https://github.com/kelektiv/node-uuid) using a library whenever we create a node and save it in a property named `nodeId`.
- `created`: The timestamp when the node was created. 
- `deleted`: The timestamp when the node was soft-deleted. We don't actually delete nodes permanently in Realities. Instead we set the `deleted` property on the node, and whenever nodes are fetched we filter out anything where the `deleted` property is set. 

### Neo4j database

The Neo4j database must have [APOC](https://github.com/neo4j-contrib/neo4j-apoc-procedures) installed to work. This is a requirements of some features in neo4j-graphql-js (more on that library below).

### neo4j-graphql-js (and why we should probably stop using it)

Besides the libraries mentioned above, we use a library called [neo4j-graphql-js](https://github.com/neo4j-graphql/neo4j-graphql-js) to help us set up and extend our GraphQL schema. neo4j-graphql-js allows us to define Neo4j relationships using an @relation GraphQL directive and custom properties with an @cypher directive. HOWEVER, we should probably stop using this library for several reasons.

First of all, neo4j-graphql-js automatically generates mutations to add/remove relationships defined with the @relation directive in the schema, but we had to swap out the @relation directives for the more raw @cypher directive since the @relation directive doesn't allow us to filter soft-deleted nodes. That meant we had to write our own queries for updating relationships.

Since we've had to skip the neo4j-graphql-js library and write our own queries in many places, we've also started running into problems when those queries don't return every related node that the frontend might have asked for in the posted GraphQL query. For example, we might have a mutation that adds a Responsibility as a dependency to a node. The GraphQL mutation returns the node and the responsibility. In GraphQL, we might want to also return the nodeId for the Need that the Relationship fulfills. That's easy enough to define in the GraphQL mutation, but it means that when we write the cypher query for that mutation in the backend we have to make sure to fetch the FULFILLS relationship for the Responsibility. Now what if we also want to fetch the guide and realizer for the Responsibility, etc, etc. It quickly gets complicated.

We will probably need to refactor the backend and write our own resolvers (and do away with the neo4j-graphql-js library) as we continue to expand the GraphQL schema. That way we can set everything up so that a GraphQL query like the one above automatically fires off several, simple cypher queries that puzzle together the requested data. That's easy enough to do with the GraphQL js library if we do away with neo4j-graphql-js.

### Inspect the GraphQL API easily using GraphiQL

When the back-end is running, explore the API using GraphiQL at [http://localhost:3100/graphiql](http://localhost:3100/graphiql). 
