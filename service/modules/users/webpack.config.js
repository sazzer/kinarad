const webpackDefaults = require("@kinarad/service-webpack");

module.exports = {
  ...webpackDefaults,
  entry: {
    get: "./src/get/index.ts",
  },
};
