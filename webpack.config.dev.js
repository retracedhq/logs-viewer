var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var HtmlWebpackTemplate = require("html-webpack-template");

module.exports = {
  mode: "development",
  entry: ["./src/dev/index.jsx"],

  module: {
    rules: [
      {
        test: /\.jsx?$/,
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

  plugins: [
    // new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      template: HtmlWebpackTemplate,
      title: "Retraced Logs Viewer",
      appMountId: "app",
      externals: [
        {
          "react-dom": {
            root: "ReactDOM",
            commonjs2: "react-dom",
            commonjs: "react-dom",
            amd: "react-dom",
          },
        },
        {
          react: {
            root: "React",
            commonjs2: "react",
            commonjs: "react",
            amd: "react",
          },
        },
      ],
    }),
  ],

  devServer: {
    port: 6012,
    host: "0.0.0.0",
    historyApiFallback: {
      verbose: true,
    },
  },
};
