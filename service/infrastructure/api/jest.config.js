const path = require('path');

module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  notify: true,
  rootDir: 'src',

  collectCoverage: true,
  coverageDirectory: path.join(__dirname, 'target/coverage'),

  moduleNameMapper: {
    '^jose/(.*)$': 'jose/dist/node/cjs/$1',
  },
};
