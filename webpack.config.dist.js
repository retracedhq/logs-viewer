var path = require("path");
var webpack = require("webpack");

var srcPath = path.join(__dirname, "src");
var appEnv = require("./env/" + (process.env.LOGS_VIEWER_ENV || "local") + ".js");

var webpackPlugins;
if (appEnv.ENVIRONMENT === "production") {
  webpackPlugins = [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.NamedModulesPlugin(),
  ];
} else {
  webpackPlugins = [
    new webpack.NamedModulesPlugin(),
  ];
}

module.exports = {
  entry: [
    "./src/index.jsx",
  ],

  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        include: srcPath,
        loaders: ["awesome-typescript-loader"],
      },
    ],
  },

  plugins: webpackPlugins,

  devtool: false,
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
