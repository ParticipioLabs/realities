// This is how you create Needs
CREATE (SafeBurn:Need {title:'Safe Burn'})
CREATE (FirstAid:Need {title:'First Aid'})


// This is how you create Responsibilities
CREATE (BurnPerimeter:Responsibility {title:'Burn Perimeter'})
CREATE (TrackWeather:Responsibility {title:'Track Weather'})
CREATE (SanctuaryVolunteers:Responsibility {title:'Vetting Sanctuary Volunteers'})
CREATE (DisasterPlan:Responsibility {title:'Disaster Plan for Burns'})

// This is how you create People
CREATE (Freya:Person {name:'Freya'})
CREATE (Vishnu:Person {name:'Vishnu'})
CREATE (Shiva:Person {name:'Shiva'})

// This is how you define relationships
CREATE
  (Freya)-[:REALIZES]->(SanctuaryVolunteers),
  (Freya)-[:GUIDES]->(TrackWeather),
  (Freya)-[:GUIDES]->(SafeBurn),
  (Freya)-[:GUIDES]->(BurnPerimeter)
CREATE
  (Vishnu)-[:GUIDES]->(DisasterPlan),
  (Vishnu)-[:GUIDES]->(FirstAid),
  (Vishnu)-[:GUIDES]->(SanctuaryVolunteers)
CREATE
  (Shiva)-[:REALIZES]->(DisasterPlan),
  (Shiva)-[:REALIZES]->(FirstAid)
CREATE
  (TrackWeather)-[:FULFILLS]->(SafeBurn),
  (BurnPerimeter)-[:FULFILLS]->(SafeBurn),
  (SanctuaryVolunteers)-[:FULFILLS]->(FirstAid),
  (DisasterPlan)-[:FULFILLS]->(FirstAid)
CREATE
  (SafeBurn)-[:DEPENDS_ON]->(DisasterPlan),
  (DisasterPlan)-[:DEPENDS_ON]->(SanctuaryVolunteers)
