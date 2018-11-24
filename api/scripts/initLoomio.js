import { initLoomioGroups, initLoomioDiscussions } from '../src/fetch/loomio';

initLoomioGroups()
  .then((result) => {
    if (!result.length) { throw new Error('no return value from initLoomioGroups()'); }
    console.log(result);
    initLoomioDiscussions()
      .then((result) => {
        if (!result.length) { throw new Error('no return value from initLoomioDiscussions()'); }
        console.log(result);
        console.log('Success!');
        process.exit();
      })
      .catch((error) => {
        console.error(`${error}`);
        process.exit();
      });
  })
  .catch((error) => {
    console.error(`${error}`);
    process.exit();
  });