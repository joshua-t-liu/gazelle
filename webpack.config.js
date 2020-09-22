const path = require('path');

module.exports = {
  mode: "development",
  entry: "./client/app.jsx",
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
          presets: ["@babel/preset-env", "@babel/preset-react"]
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    // alias: {
    //   // ...
    //   'react-dom$': 'react-dom/profiling',
    //   'scheduler/tracing': 'scheduler/tracing-profiling',
    // },
  },
  externals: {
    'chart.js': 'Chart',
  }
};