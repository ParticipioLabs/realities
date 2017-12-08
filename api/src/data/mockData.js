export default {
  needs: [{
    id: 'need1',
    title: 'Need 1',
    dependsOn: ['need2'],
  }, {
    id: 'need2',
    title: 'Need 2',
    dependsOn: [],
  }, {
    id: 'need3',
    title: 'Need 3',
    dependsOn: [],
  }],
};
