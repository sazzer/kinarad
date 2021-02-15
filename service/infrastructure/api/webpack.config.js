const webpackDefaults = require("@kinarad-service/webpack");

module.exports = {
  ...webpackDefaults,
  entry: {
    authorizer: "./src/lambdas/authorizer.ts",
  },
};
