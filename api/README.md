# Realities Back-end

The Realities back-end is a simple Node.js service that exposes a GraphQL API via a /graphql endpoint. It reads and stores data in a Neo4j graph database. 

## How to contribute

Most of the back-end code is in a single index.js file right now. That needs to be changed as the complexity of the back-end grows. The index file defines the GraphQL schema and GraphQL resolvers, and sets up the GraphQL endpoint using [express](https://expressjs.com/) and [apollo-server-express v1](https://github.com/apollographql/apollo-server). It also uses the [express-jwt](https://github.com/auth0/express-jwt) middleware to validate and parse the [Json Web Token (JWT)](https://jwt.io/) sent as an authentication header in every request from the front-end when the user is logged in.

### Authentication with Auth0

When the user is logged in, they send a JWT in an authentication header with every request. The JWT is validated and parsed using the [express-jwt](https://github.com/auth0/express-jwt) middleware. When we use [graphql-server-express](https://www.npmjs.com/package/graphql-server-express) to set up the GraphQL endpoint, the parsed JWT is made available to our GraphQL resolvers in a `user` property on their [context argument](https://graphql.org/graphql-js/graphql/#graphql). The user's email and role can be used in the resolver to determine whether they have access to do whatever they're trying to do. If they don't, an error with a message should be thrown and GraphQL will take care of sending an appropriate error response to the front-end.

We've set up custom [rules in Auth0](https://auth0.com/docs/rules/current) that add the user's email and role to the JWT when the user logs in. The user's role is either `'user'` (if they're a regular user) or `'admin'` (if they're a realities admin). To make a user a realities admin, log into Auth0, look them up under 'Users' and add the following to their `app_metadata`: 

```
{
  "role": "admin"
}
```

### Neo4j/GraphQL schema

Neo4j doesn't really have a fixed schema, but we have an implicit schema that is also codified in the GraphQL schema.

We have three main types in our schema, namely `Person`, `Need` and `Responsibliity`. Each of these have their own properties that are somewhat self-explanatory. Some notable properties that might not be self-explanatory are: 

- `nodeId`: Neo4j's native ID's are semantic. They're basically just an integer that gets incremented every time you create a node. They start counting from the highest current ID number. This creates a few problems if we try to use Neo4j's native IDs as UUIDs throughout the system. For example, we use a need's UUID in the URL on the front-end to keep track of which need is selected in the UI. That means that people can send each other links to a specific need. If you remove a need in Neo4j and create a new one, the new need might end up getting the same ID as the old one you created. That's not ideal. Instead of using Neo4j's native ID to identify nodes, we generate our own [UUID v4](https://github.com/kelektiv/node-uuid) using a library whenever we create a node and save it in a property named `nodeId`.
- `created`: The timestamp when the node was created. 
- `deleted`: The timestamp when the node was soft-deleted. We don't actually delete nodes permanently in Realities. Instead we set the `deleted` property on the node, and whenever nodes are fetched we filter out anything where the `deleted` property is set. 

### Neo4j database

The Neo4j database must have [APOC](https://github.com/neo4j-contrib/neo4j-apoc-procedures) installed to work. This is a requirements of some features in neo4j-graphql-js (more on that library below).

### graphql-tools

The GraphQL schema is defined using a set of tools from Apollo named [graphql-tools](https://www.apollographql.com/docs/graphql-tools/). The tools are built around a backend architecture that Apollo recommends when building a GraphQL API, but they are functional and modular enough that we can swap out pieces in the future if it proves useful. 

### Inspect the GraphQL API easily using GraphiQL

When the back-end is running, explore the API using GraphiQL at [http://localhost:3100/graphiql](http://localhost:3100/graphiql). 

### Loomio Interface (optional)

[Loomio](https://loomio.com/) is a web site that hosts discussion groups.  Realities accesses the [Loomio API](https://help.loomio.org/en/dev_manual/using_the_api/)
to enhance the user experience when adding Deliberation links (`Info` nodes) to a `Need` or `Responsibility`, and to allow graphing of
connections between those nodes.

To activate the Loomio connection, add the following parameters to your .env file:

```
LOOMIO_API_BASE=https://your-loomio-domain.com/api/v1
LOOMIO_SITE_BASE=https://your-loomio-domain.com
LOOMIO_CRON_SCHEDULE='5 * * * *'
```

There are two ways Loomio discussions and groups are added to the database.

1. The system should be initialized with *all* currently existing discussions and groups, like this:
```
cd api
npm run init-loomio
```
1. The system regularly downloads new discussions and groups using a cron-like scheduler.  It retrieves anything created
in the last 24 hours.  Therefore, the scheduler should be set to anything less than 24 hours.  The syntax of the
scheduler follows the standard [cron syntax](https://en.wikipedia.org/wiki/Cron).
Example:
```
LOOMIO_CRON_SCHEDULE='5 * * * *' // Update once per hour, at hh:05
or
LOOMIO_CRON_SCHEDULE='*/10 * * * *' // Update every 10 minutes
```
