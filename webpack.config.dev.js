var path = require("path");
var webpack = require("webpack");

var srcPath = path.join(__dirname, "src");

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

  plugins: [
    new webpack.NamedModulesPlugin(),
  ],
  
  devServer: {
    port: 6012,
    historyApiFallback: {
      verbose: true,
    },
  },
};
