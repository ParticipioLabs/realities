const typeDefs = `
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }

  type Subscription {
    realityCreated: Reality
    realityDeleted: Reality
    realityUpdated: Reality
  }

  type Query {
    persons(search: String): [Person]
    person(
      email: String
      nodeId: ID
    ): Person
    needs(search: String): [Need]
    need(nodeId: ID!): Need
    responsibilities(fulfillsNeedId: ID, search: String): [Responsibility]
    responsibility(nodeId: ID!): Responsibility
    orgs: [Org]
    org(orgSlug: String): Org
    infos(search: String): [Info]
    info(url: String!): [Info]
  }

  type Mutation {
    createNeed(title: String!): Need
    createResponsibility(
      title: String!
      needId: ID!
    ): Responsibility 
    createViewer: Person
    createOrg(
      name: String
      orgSlug: String
    ): Org
    updateNeed(
      nodeId: ID!
      title: String!
      guideEmail: String!
      description: String
    ): Need
    updateResponsibility(
      nodeId: ID!
      title: String!
      guideEmail: String!
      realizerEmail: String
      description: String
    ): Responsibility
    changeFulfills(responsibilityId: ID!, needId: ID!): Responsibility
    updateViewerName(name: String!): Person
    softDeleteNeed(nodeId: ID!): Need
    softDeleteResponsibility(nodeId: ID!): Responsibility
    addResponsibilityDependsOnResponsibilities(
      from: _ResponsibilityInput!
      to: _ResponsibilityInput!
    ): _ResponsibilityDependsOnResponsibilitiesPayload
    removeResponsibilityDependsOnResponsibilities(
      from: _ResponsibilityInput!
      to: _ResponsibilityInput!
    ): _ResponsibilityDependsOnResponsibilitiesPayload
    updateInfo(
      url: String!
      title: String!
    ): Info
    softDeleteInfo(url: String!): Info
    addRespHasDeliberation(
      from: _ResponsibilityInput!
      to: _InfoInput!
    ): _RespHasDeliberationPayload
    removeRespHasDeliberation(
      from: _ResponsibilityInput!
      to: _InfoInput!
    ): _RespHasDeliberationPayload
  }

  type Person {
    nodeId: ID!
    name: String
    email: String!
    created: String
    guidesNeeds: [Need]
    guidesResponsibilities: [Responsibility]
    realizesResponsibilities: [Responsibility]
  }

  interface Reality {
    nodeId: ID!
    title: String!
    description: String
    created: String
    deleted: String
    guide: Person
  }

  type Need implements Reality {
    nodeId: ID!
    title: String!
    description: String
    created: String
    deleted: String
    guide: Person
    fulfilledBy: [Responsibility]
  }

  type Responsibility implements Reality {
    nodeId: ID!
    title: String!
    description: String
    created: String
    deleted: String
    guide: Person
    realizer: Person
    fulfills: Need
    dependsOnResponsibilities: [Responsibility]
    responsibilitiesThatDependOnThis: [Responsibility]
    deliberations: [Info]
  }

  type Org {
    orgId: ID!
    name: String!
    orgSlug: String!
  }

  type Info {
    nodeId: ID!
    url: String!
    title: String
    isDeliberationFor: [Responsibility]
    created: String
    deleted: String
  }

  input _NeedInput {
    nodeId: ID!
  }

  input _ResponsibilityInput {
    nodeId: ID!
  }

  input _RealityInput {
    nodeId: ID!
  }

  input _InfoInput {
    url: String!
  }

  type _ResponsibilityDependsOnResponsibilitiesPayload {
    from: Responsibility
    to: Responsibility
  }

  type _RespHasDeliberationPayload {
    from: Responsibility
    to: Info
  }
`;

export default typeDefs;
