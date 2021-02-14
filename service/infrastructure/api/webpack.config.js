const path = require("path");

module.exports = {
  entry: {
    authorizer: "./src/authorizer/index.ts",
  },
  target: "node",
  mode: "production",
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    libraryTarget: "commonjs",
    filename: "[name].js",
    path: path.resolve(__dirname, "target/lambdas"),
  },
};
