module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',
  },
  env: {
    node: true,
  },
  extends: 'airbnb-base',
  'rules': {
    'no-console': 'off',
    'import/no-unresolved': 'off',
    'no-underscore-dangle': 0,
  },
};
