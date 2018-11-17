// Start driver 
const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "neo4j"));

// Start session
const session = driver.session();

// It is possible to execute write transactions that will benefit from automatic retries
let writeTxResultPromise = session.writeTransaction(function (transaction) {
  // used transaction will be committed automatically, no need for explicit commit/rollback
  let result = transaction.run('MERGE (n:Person {name : {nameParam} }) RETURN n', {nameParam: 'Bob'});
  // return the result or process it and return the result of processing
  // it is also possible to run more statements in the same transaction
  return result;
});

// returned Promise can be later consumed like this:
writeTxResultPromise.then(function (returnedNode) {
  session.close();
  console.log(returnedNode);
}).catch(function (error) {
  console.log(error);
});
