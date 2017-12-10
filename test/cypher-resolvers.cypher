// All of these queries should be run inside transaction.run()

// createNeedMutation Resolver
// When we have auth, this should also take RealityGuide at creation
transaction.run(
	'MERGE (need:Need {title:{titleParam}) 
	WITH (need) 
	SET need.nodeId = ID(need) 
	RETURN need', 
	{titleParam: 'titleGoesHere'});

// createNeedResponsibility Resolver
// When we have auth, this should also take RealityGuide at creation
// This write query also ensures that you can't create a responsibility with the same title as another responsibility for the same need
transaction.run(
	'MATCH (need) 
	WHERE ID(need) = {needIdParam} 
	MERGE (resp:Responsibility {title:{titleParam}}) -[:FULFILLS]-> (need)
    WITH (resp)
    SET resp.nodeId = ID(resp)
	RETURN resp', 
	{needIdParam: 'needIdGoesHere', titleParam: 'titleGoesHere'};)

// removeResponsibility Resolver
// Sets is_deleted timestamp to 
transaction.run('MATCH (resp) WHERE ID(resp) = {respIdParam} WITH (resp) MATCH (resp)-[r]-() SET resp.is_deleted = timestamp() SET r.is_deleted =  timestamp() RETURN resp, r',{respIdParam: 'needIdGoesHere'};)