var path = require("path");
var webpack = require("webpack");

var srcPath = path.join(__dirname, "src");

module.exports = {
  entry: [
    "react-hot-loader/patch",
    "./src/index.jsx",
  ],

  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        include: srcPath,
        loaders: ["react-hot-loader/webpack", "awesome-typescript-loader"],
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
  
  devServer: {
    hot: true,
    hotOnly: true,
    port: 6012,
    historyApiFallback: {
      verbose: true,
    },
  },
};
