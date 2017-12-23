module.exports = {
  'extends': 'airbnb',
  'env': {
    'browser': true,
    'jest': true
  },
  'parser': 'babel-eslint',
  'rules': {
    'react/jsx-filename-extension': [
      1,
      {
        'extensions': [
          '.js',
          '.jsx'
        ]
      }
    ],
    'import/no-extraneous-dependencies': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'jsx-a11y/anchor-is-valid': [
      1,
      {
        components: [
          'Link'
        ],
        specialLink: [
          'to',
          'hrefLeft',
          'hrefRight'
        ],
        aspects: [
          'noHref',
          'invalidHref',
          'preferButton'
        ]
      }
    ],
    'no-console': [
      1,
      {
        'allow': [
          'warn',
          'error'
        ]
      }
    ],
    'no-underscore-dangle': 0,
    'no-console': 0
  }
};
