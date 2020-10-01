const path = require('path');

module.exports = {
  mode: "production",
  entry: {
    bundle: "./client/app.jsx",
    worker: "./client/components/useProcessor/worker.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
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
