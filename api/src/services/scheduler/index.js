import { scheduler as loomioScheduler } from '../../fetch/loomio';

// Add api fetch schedulers here.
const startApiFetchSchedulers = () => {
  loomioScheduler();
};

// Start all schedulers.  Add any other schedulers here.
const startSchedulers = () => {
  startApiFetchSchedulers();
};

export default startSchedulers;
