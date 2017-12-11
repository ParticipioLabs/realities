MERGE (SafeBurn:Need {title:'Safe Burn', description:'Create a safe event for all participants.', status:'green', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId: 1421})
MERGE (FirstAid:Need {title:'First Aid', description:'Provide first aid service to event participants.', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId: 54532})
MERGE (Sanitation:Need {title:'Sanitation', description:'Provide portopotties to event participants.', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId: 1484930221})
MERGE (Placement:Need {title:'Placement', description:'Camps placed in a sane manner.', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId: 143424221})
MERGE (SoundControl:Need {title:'SoundControl', description:'Control sound level of sound camps.', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId: 9999})

MERGE (BurnPerimeter:Responsibility {title:'Burn Perimeter', description:'Maintaining a perimeter around the burn.', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId: 1434242244221})
MERGE (TrackWeather:Responsibility {title:'Track Weather', description:'Monitoring the weather.', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId: 1434242212223241})
MERGE (SanctuaryVolunteers:Responsibility {title:'Vetting Sanctuary Volunteers', description:'Interviewing Sanctuary volunteers to make sure they have required skills.', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId: 8943})
MERGE (DisasterPlan:Responsibility {title:'Disaster Plan for Burns', description:'Planning for people who get burned.', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId: 143424278943221})
MERGE (PortopottiePlacement:Responsibility {title:'Portopottie Placement', description:'Deciding where to put portopotties.', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId: 14748193424221})
MERGE (PlacementMap:Responsibility {title:'Placement Map', description:'Creating placement maps for camps.', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId: 14342422129})
MERGE (SoundMeasurement:Responsibility {title:'Measure Sound levels', description:'Measuring decibel levels.', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId: 1434242213323})
MERGE (SoundCurfewPlanning:Responsibility {title:'Sound Curfew Planning', description:'Planning loudness locations and schedules.', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId: 14390321424221})
MERGE (BookPortopotties:Responsibility {title:'Book Portopotties', description:'Booking portopotties.', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId: 143424711111221})

MERGE (Freya:Person {name:'Freya', email:'freya@gmail.com', nodeId: 11111143424221})
MERGE (Vishnu:Person {name:'Vishnu', email:'vishnu@gmail.com', nodeId: 1434249322221})
MERGE (Shiva:Person {name:'Shiva', email:'shiva@gmail.com', nodeId: 143424227272721})
MERGE (Hampus:Person {name:'Hampus', email:'hampus@gmail.com', nodeId: 111111})

CREATE
  (Hampus)-[:REALIZES]->(PlacementMap),
  (Hampus)-[:GUIDES]->(SafeBurn),
  (Hampus)-[:GUIDES]->(FirstAid),
  (Hampus)-[:GUIDES]->(Sanitation),
  (Hampus)-[:GUIDES]->(Placement),
  (Hampus)-[:GUIDES]->(SoundControl)
CREATE
  (Freya)-[:REALIZES]->(SanctuaryVolunteers),
  (Freya)-[:GUIDES]->(TrackWeather),
  (Freya)-[:GUIDES]->(BurnPerimeter)
CREATE
  (Vishnu)-[:GUIDES]->(DisasterPlan),
  (Vishnu)-[:GUIDES]->(PortopottiePlacement),
  (Vishnu)-[:GUIDES]->(BookPortopotties),
  (Vishnu)-[:GUIDES]->(PlacementMap),
  (Vishnu)-[:GUIDES]->(SanctuaryVolunteers)
CREATE
  (Shiva)-[:REALIZES]->(DisasterPlan),
  (Shiva)-[:REALIZES]->(FirstAid),
  (Shiva)-[:GUIDES]->(SoundMeasurement),
  (Shiva)-[:GUIDES]->(SoundCurfewPlanning)

CREATE
  (TrackWeather)-[:FULFILLS]->(SafeBurn),
  (BurnPerimeter)-[:FULFILLS]->(SafeBurn),
  (SanctuaryVolunteers)-[:FULFILLS]->(FirstAid),
  (DisasterPlan)-[:FULFILLS]->(FirstAid),
  (PortopottiePlacement)-[:FULFILLS]->(Sanitation),
  (BookPortopotties)-[:FULFILLS]->(Sanitation),
  (PlacementMap)-[:FULFILLS]->(Placement),
  (SoundMeasurement)-[:FULFILLS]->(SoundControl),
  (SoundCurfewPlanning)-[:FULFILLS]->(SoundControl)

CREATE
  (SafeBurn)-[:DEPENDS_ON]->(DisasterPlan),
  (DisasterPlan)-[:DEPENDS_ON]->(SanctuaryVolunteers),
  (PlacementMap)-[:DEPENDS_ON]->(SoundCurfewPlanning),
  (PortopottiePlacement)-[:DEPENDS_ON]->(PlacementMap)