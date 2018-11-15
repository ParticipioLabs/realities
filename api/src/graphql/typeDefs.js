const typeDefs = `
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }

  type Subscription {
    needAdded:Need
  }

  type Query {
    persons(search: String): [Person]
    person(email: String!): Person
    needs(search: String): [Need]
    need(nodeId: ID!): Need
    responsibilities(search: String): [Responsibility]
    responsibility(nodeId: ID!): Responsibility
  }

  type Mutation {
    createNeed(title: String!): Need
    createResponsibility(
      title: String!
      needId: ID!
    ): Responsibility 
    createViewer: Person
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
    deliberationLink: String
    created: String
    deleted: String
    guide: Person
    realizer: Person
    dependsOnNeeds: [Need]
    dependsOnResponsibilities: [Responsibility]
    needsThatDependOnThis: [Need]
    responsibilitiesThatDependOnThis: [Responsibility]
  }

  type Need implements Reality {
    nodeId: ID!
    title: String!
    description: String
    deliberationLink: String
    created: String
    deleted: String
    guide: Person
    realizer: Person
    fulfilledBy: [Responsibility]
    dependsOnNeeds: [Need]
    dependsOnResponsibilities: [Responsibility]
    needsThatDependOnThis: [Need]
    responsibilitiesThatDependOnThis: [Responsibility]
  }

  type Responsibility implements Reality {
    nodeId: ID!
    title: String!
    description: String
    deliberationLink: String
    created: String
    deleted: String
    guide: Person
    realizer: Person
    fulfills: Need
    dependsOnNeeds: [Need]
    dependsOnResponsibilities: [Responsibility]
    needsThatDependOnThis: [Need]
    responsibilitiesThatDependOnThis: [Responsibility]
  }

  input _NeedInput {
    nodeId: ID!
  }

  input _ResponsibilityInput {
    nodeId: ID!
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
`;

export default typeDefs;
