var path = require("path");
var webpack = require("webpack");

var srcPath = path.join(__dirname, "src");
var appEnv = require("./env/" + (process.env.LOGS_VIEWER_ENV || "local") + ".js");

module.exports = {
  optimization: {
    minimize: true //Update this to true or false
  },
  entry: [
    "./src/index.jsx",
  ],
  mode: "production",
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        include: srcPath,
        loaders: ["awesome-typescript-loader"],
      },
    ],
  },

  plugins: [
    new webpack.optimize.AggressiveMergingPlugin(),
    // new webpack.optimize.UglifyJsPlugin(),
  ],

  devtool: 'source-map',
  stats: {
    colors: true,
    reasons: false
  },

  node: {
    dns: 'empty',
    net: 'empty',
    tls: 'empty'
  },
};
