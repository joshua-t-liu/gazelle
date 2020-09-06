const path = require('path');

module.exports = {
  mode: "production",
  entry: "./app/entry",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        options: {
          presets: ["es2015"]
        },
      },
    ],
  },
};