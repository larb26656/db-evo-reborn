const path = require("path");
const webpack = require("webpack");
const packageJson = require("./package.json");

module.exports = {
  entry: "./main.js", // Replace with your entry file
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
  target: "node",
  mode: "production",
  externals: {
    "pg-native": "commonjs pg-native",
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.VERSION": JSON.stringify(packageJson.version),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
