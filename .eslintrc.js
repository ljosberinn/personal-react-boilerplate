module.exports = {
  extends: ['react-app', 'kentcdodds/jest'],
  rules: {
    'import/order': [
      'warn',
      {
        groups: [
          ['builtin', 'external', 'internal'],
          ['unknown', 'parent', 'sibling'],
          'index',
        ],
        alphabetize: {
          order: 'asc',
        },
        'newlines-between': 'always',
      },
    ],
  },
};
