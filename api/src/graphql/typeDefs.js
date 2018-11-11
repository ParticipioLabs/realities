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
    person(email: String!): Person
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
`;

export default typeDefs;
