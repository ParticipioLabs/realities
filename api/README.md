# Realities Back-end

The Realities back-end is a simple Node.js service that exposes a GraphQL API via a /graphql endpoint. It primarily reads and stores data in a Neo4j graph database, but also interacts with the Plato Core mongodb server. 

## Core concepts

### Authentication with Keycloak

When the user is logged in, they send a [Json Web Token (JWT)](https://jwt.io/) in an authentication header with every request. The JWT is validated and parsed using some middleware. When we set up the GraphQL endpoint, the parsed JWT is made available to our GraphQL resolvers in a `user` property on their [context argument](https://graphql.org/graphql-js/graphql/#graphql). The user's info can be used in the resolver to determine whether they have access to do whatever they're trying to do. If they don't, an error with a message should be thrown and GraphQL will take care of sending an appropriate error response to the front-end.

### Neo4j/GraphQL schema

Neo4j doesn't really have a fixed schema, but we have an implicit schema that is also codified in the GraphQL schema.

We have three main types in our schema, namely `Org`, `Person`, `Need` and `Responsibliity`. Each of these have their own properties that are somewhat self-explanatory. Some notable properties that might not be self-explanatory are: 

- `nodeId`: Neo4j's native ID's are semantic. They're basically just an integer that gets incremented every time you create a node. They start counting from the highest current ID number. This creates a few problems if we try to use Neo4j's native IDs as UUIDs throughout the system. For example, we use a need's UUID in the URL on the front-end to keep track of which need is selected in the UI. That means that people can send each other links to a specific need. If you remove a need in Neo4j and create a new one, the new need might end up getting the same ID as the old one you created. That's not ideal. Instead of using Neo4j's native ID to identify nodes, we generate our own [UUID v4](https://github.com/kelektiv/node-uuid) using a library whenever we create a node and save it in a property named `nodeId`.
- `orgId`: Acting a bit like `nodeId`, but sits on `Org`s instead. We don't generate it as a uuid, it instead is the same as the corresponding org's `_id` in plato core.
- `created`: The timestamp when the node was created. 
- `deleted`: The timestamp when the node was soft-deleted. We don't actually delete nodes permanently in Realities. Instead we set the `deleted` property on the node, and whenever nodes are fetched we filter out anything where the `deleted` property is set. 

### graphql-tools

The GraphQL schema is defined using a set of tools from Apollo named [graphql-tools](https://www.apollographql.com/docs/graphql-tools/). The tools are built around a backend architecture that Apollo recommends when building a GraphQL API, but they are functional and modular enough that we can swap out pieces in the future if it proves useful. 

### Inspect the GraphQL API easily

When the back-end is running, explore the API at [http://localhost:3100/graphql](http://localhost:3100/graphql). 

### Interaction with Plato Core

TODO: explain

### Loomio Interface (optional)

[Loomio](https://loomio.com/) is a web site that hosts discussion groups.  Realities accesses the [Loomio API](https://help.loomio.org/en/dev_manual/using_the_api/)
to enhance the user experience when adding Deliberation links (`Info` nodes) to a `Need` or `Responsibility`, and to allow graphing of
connections between those nodes.

To activate the Loomio connection, add the following parameters to your .env file:

```
LOOMIO_API_BASE=https://your-loomio-domain.com/api/v1
LOOMIO_SITE_BASE=https://your-loomio-domain.com
LOOMIO_CRON_SCHEDULE='*/10 * * * *'
```

There are two ways Loomio discussions and groups are added to the database.

1. The system should be initialized with *all* currently existing discussions and groups, like this:
```
cd api
npm run init-loomio
```
2. The system regularly downloads new discussions and groups using a cron-like scheduler.  It retrieves anything created
in the last 24 hours.  Therefore, the scheduler should be set to anything less than 24 hours.  The syntax of the
scheduler follows the standard [cron syntax](https://en.wikipedia.org/wiki/Cron).
Example:
```
LOOMIO_CRON_SCHEDULE='5 * * * *' // Update once per hour, at hh:05
or
LOOMIO_CRON_SCHEDULE='*/10 * * * *' // Update every 10 minutes
```
