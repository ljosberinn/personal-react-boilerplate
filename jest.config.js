module.exports = {
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/scripts/**',
    '!**/public/**',
    '!**/coverage/**',
    '!.eslintrc.js',
    '!**/types.ts',
    '!testUtils/**',
    // TODO: REMOVE THESE WHEN ACTUALLY DEVELOPING!
    '!**/src/client/routes/**',
    // you can keep this if you actually have no logic in there
    '!**/pages/api/v1/**',
  ],
  setupFilesAfterEnv: ['<rootDir>/scripts/jest/setupTests.js'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': '<rootDir>/scripts/jest/cssTransform.js',
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  modulePaths: ['<rootDir>'],
  coverageDirectory: 'coverage',
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
};
