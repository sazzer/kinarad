const path = require('path');

module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  notify: true,
  rootDir: 'src',

  resetMocks: true,

  collectCoverage: true,
  coverageDirectory: path.join(__dirname, 'target/coverage'),
};
