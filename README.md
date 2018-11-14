# Realities Platform

A tool for tribal decentralised organisations. [Read more about the concept behind it here](https://edgeryders.eu/t/realities-project-white-paper/9064).

## Wanna talk about it?

To discuss and learn more about the overall concepts behind the Realities Platform, [head over to the Edgeryders platform](https://edgeryders.eu/c/workspaces/participio), where Realities is being developed as part of the Particip.io project.

To report a bug or suggest a specific improvement or feature, create an issue right here on GitHub.

If you want to chat to other members of the community and collaborate in real-time, head over to our [Gitter](https://gitter.im/realities).

## Dependencies

  * nodejs 8.9.x
  * npm 5.5.x
  * neo4j
  * neo4j [apoc](https://neo4j-contrib.github.io/neo4j-apoc-procedures/) 
  
## How to contribute

### Maintain consistency and follow conventions

As the codebase grows, it's important that everyone contributing to it follow the same conventions. Keeping a codebase consistent and easy to work with is hard and requires diligence. Take some time to understand the way the codebase is organized before you make your first commit. If you have suggestions as to how structure or conventions can be improved, bring it up with the community so that we can make improvements throughout the whole codebase and maintain consistency. 

### Linting

We use ESLint with the [Airbnb config](https://github.com/airbnb/javascript) for code formatting. Before you commit, make sure you've fixed all linting errors and warnings. Don't turn off the linting rule that is giving you problems unless you really, really, really know what you're doing. 

### Work in feature branches

When working on a new feature, create a new git branch and collaborate with others in that branch. When the feature is tested and finished, the feature branch can be merged into master. Anything pushed to master will automatically be deployed to Heroku as long as there are no linting errors or warnings. [Read more...](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow)

### Front-end and back-end

Realities is split into a single-page web app built in React (found under `ui`) and a Node.js back-end that exposes a GraphQL API (found under `api`). Each of these have their own conventions and required reading found in the README files in their respective directories.

[Read more about the UI...](./ui/README.md)

[Read more about the API...](./api/README.md)

### GraphQL API

[GraphQL](https://graphql.org/) is a query language developed by Facebook to replace the REST API architecture. The Realities back-end exposes a GraphQL API that the front-end uses to fetch and mutate data. In a nutshell, there is only one single API endpoint (/graphql) and the front-end sends a query to the back-end using that endpoint that describes all the data that the front-end needs to render a particular view or state. The back-end creates a response based on the query and returns all the data the front-end needs in a single http response. This reduces overfetching and makes it easy for front-end developers to change the data they fetch without having to make changes to the back-end code. [Learn more about GraphQL here...](https://graphql.org/learn/)

We use various libraries on the back-end to set up our GraphQL API. On the front-end, we mainly use [Apollo Client](https://www.apollographql.com/docs/react/) to help us manage fetching and mutating data through the API.

### Authentication with Auth0

We use [Auth0](https://auth0.com/) for Authentication and Authorization. When a user signs up or logs in on the front-end, they are taken through a flow where Auth0 creates a [Jason Web Token (JWT)](https://jwt.io/) that is returned to the front-end and stored in the browser's localStorage. We've created [rules in Auth0](https://auth0.com/docs/rules/current) that add the user's email and role (whether they are a Reality Admin or a normal user) securely to the JWT. The front-end sends the JWT to the back-end with every API call in an http header. The back-end validates the JWT, fetches the user's email and role from it and can then determine whether the user has permission to do whatever they are trying to do. 

## Install and run locally

Realities uses a Neo4j database. You need to run Neo4j on your machine or connect to a remote database (for example a free 1000 node sandbox at http://graphenedb.com). Running a local Neo4j database is very easy, just go to https://neo4j.com/download/ and follow the instructions.

Set up your connection variables to Neo4j in `api/.env`. With Neo4j running locally, these variables should work for default setups:

```
GRAPHENEDB_URL=bolt://127.0.0.1:7687
GRAPHENEDB_NAME=''
GRAPHENEDB_KEY=''
```

Make sure you're running the versions of node and npm specified in the api and ui package.json files (node 8.9.x and npm 5.5.x), then...

```bash
$ npm install
$ npm start
```

You can also `cd` into the `ui` and `api` directories separately and `npm start` them individually. That may be more practical during development since you'll get separate logs for the front-end and back-end. 
