const path = require("path");

module.exports = {
  entry: {},
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
    path: path.resolve("./target/lambdas"),
  },
};
