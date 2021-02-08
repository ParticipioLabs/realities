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
      realizerEmail: String
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
    removeNeedDependsOnNeeds(
      from: _NeedInput!
      to: _NeedInput!
    ): _NeedDependsOnNeedsPayload
    removeNeedDependsOnResponsibilities(
      from: _NeedInput!
      to: _ResponsibilityInput!
    ): _NeedDependsOnResponsibilitiesPayload
    removeResponsibilityDependsOnNeeds(
      from: _ResponsibilityInput!
      to: _NeedInput!
    ): _ResponsibilityDependsOnNeedsPayload
    removeResponsibilityDependsOnResponsibilities(
      from: _ResponsibilityInput!
      to: _ResponsibilityInput!
    ): _ResponsibilityDependsOnResponsibilitiesPayload
    updateInfo(
      url: String!
      title: String!
    ): Info
    softDeleteInfo(url: String!): Info
    addRealityHasDeliberation(
      from: _RealityInput!
      to: _InfoInput!
    ): _RealityHasDeliberationPayload
    removeRealityHasDeliberation(
      from: _RealityInput!
      to: _InfoInput!
    ): _RealityHasDeliberationPayload
  }

  type Person {
    nodeId: ID!
    name: String
    email: String!
    created: String
    guidesNeeds: [Need]
    realizesNeeds: [Need]
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
    realizer: Person
    dependsOnNeeds: [Need]
    dependsOnResponsibilities: [Responsibility]
    needsThatDependOnThis: [Need]
    responsibilitiesThatDependOnThis: [Responsibility]
    deliberations: [Info]
  }

  type Need implements Reality {
    nodeId: ID!
    title: String!
    description: String
    created: String
    deleted: String
    guide: Person
    realizer: Person
    fulfilledBy: [Responsibility]
    dependsOnNeeds: [Need]
    dependsOnResponsibilities: [Responsibility]
    needsThatDependOnThis: [Need]
    responsibilitiesThatDependOnThis: [Responsibility]
    deliberations: [Info]
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
    dependsOnNeeds: [Need]
    dependsOnResponsibilities: [Responsibility]
    needsThatDependOnThis: [Need]
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
    isDeliberationFor: [Reality]
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

  type _RealityHasDeliberationPayload {
    from: Reality
    to: Info
  }
`;

export default typeDefs;
