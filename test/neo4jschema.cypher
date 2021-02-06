// TODO: use this file (modify it to follow the current schema first) as
// a fixture for our e2e tests
MERGE
  (SafeBurn:Need {title:'Demo: Safe Burn', description:'Create a safe event for all participants.', status:'green', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId:'2dea1e7d-2e02-4aea-9d17-d42e980beb85'})
MERGE
  (FirstAid:Need {title:'Demo: First Aid', description:'Provide first aid service to event participants.', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId:'b03facab-3cc0-4a06-9c50-7c5b2d8d64fd'})
MERGE
  (Sanitation:Need {title:'Demo: Sanitation', description:'Provide portopotties to event participants.', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId:'6b8dc712-28a2-4532-a7f5-81ee724b8d35'})
MERGE
  (Placement:Need {title:'Demo: Placement', description:'Camps placed in a sane manner.', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId:'74c2abd5-8518-48a7-9cef-1652fd40dbd5'})
MERGE
  (SoundControl:Need {title:'Demo: SoundControl', description:'Control sound level of sound camps.', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId:'cf22aa85-bbc5-4fa5-a17d-07702d1312a7'})

MERGE
  (BurnPerimeter:Responsibility {title:'Demo: Burn Perimeter', description:'Maintaining a perimeter around the burn.', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId:'d9843014-dff6-4609-af02-84614901a396'})
MERGE
  (TrackWeather:Responsibility {title:'Demo: Track Weather', description:'Monitoring the weather.', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId:'93cdb585-23e4-46bb-bd62-94855c527385'})
MERGE
  (SanctuaryVolunteers:Responsibility {title:'Demo: Vetting Sanctuary Volunteers', description:'Interviewing Sanctuary volunteers to make sure they have required skills.', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId:'8e37fce6-401a-411b-9706-eb9a96360699'})
MERGE
  (DisasterPlan:Responsibility {title:'Demo: Disaster Plan for Burns', description:'Planning for people who get burned.', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId:'6341d185-46f6-41a1-9aca-787ecc00e831'})
MERGE
  (PortopottiePlacement:Responsibility {title:'Demo: Portopottie Placement', description:'Deciding where to put portopotties.', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId:'53f95d7b-4d4a-41e1-ab43-13f8ed40392e'})
MERGE
  (PlacementMap:Responsibility {title:'Demo: Placement Map', description:'Creating placement maps for camps.', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId:'b87e6f1a-0e07-4194-8d63-28adcafdab8e'})
MERGE
  (SoundMeasurement:Responsibility {title:'Demo: Measure Sound levels', description:'Measuring decibel levels.', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId:'de5ffb2c-4ec5-4d3b-b34c-ef9146ea30f8'})
MERGE
  (SoundCurfewPlanning:Responsibility {title:'Demo: Sound Curfew Planning', description:'Planning loudness locations and schedules.', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId:'6ca04686-2745-42fd-a295-8a7852cba278'})
MERGE
  (BookPortopotties:Responsibility {title:'Demo: Book Portopotties', description:'Booking portopotties.', deliberationLink:'https://www.loomio.org/g/cbghMtnL/borderland-realities', nodeId:'56569c8b-87a4-45be-a506-783dc7bfe070'})

MERGE
  (Freya:Person {name:'Freya', email:'freya@gmail.com', nodeId:'39ca9c71-9ff7-4e0a-9d71-e53b8d2e18c9'})
MERGE
  (Vishnu:Person {name:'Vishnu', email:'vishnu@gmail.com', nodeId:'d76afe5b-5c11-49a9-95a7-e8cd1e5bc379'})
MERGE
  (Shiva:Person {name:'Shiva', email:'shiva@gmail.com', nodeId:'5df5e531-6e21-4b98-9cd9-75c695d34061'})
MERGE
  (Hampus:Person {name:'Hampus', email:'hampus@gmail.com', nodeId:'425d16c1-d9a6-4d08-ab74-e0148b2b01f3'})

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
