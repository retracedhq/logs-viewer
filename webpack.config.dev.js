var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var HtmlWebpackTemplate = require("html-webpack-template");

var srcPath = path.join(__dirname, "src");
var devPath = path.join(__dirname, "dev");

module.exports = {
  entry: [
    "./dev/index.jsx",
  ],

  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        include: [srcPath, devPath],
        loaders: ["awesome-typescript-loader"],
      },
    ],
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: HtmlWebpackTemplate,
      title: "Retraced Logs Viewer",
      appMountId: "app",
    }),
  ],
  
  devServer: {
    port: 6012,
    host: '0.0.0.0',
    historyApiFallback: {
      verbose: true,
    },
  },
};
