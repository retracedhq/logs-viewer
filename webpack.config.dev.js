const path = require("path");
const fs = require("fs");

var HtmlWebpackPlugin = require("html-webpack-plugin");

const appDirectory = fs.realpathSync(process.cwd());
const resolveAppPath = (relativePath) =>
  path.resolve(appDirectory, relativePath);

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
    new HtmlWebpackPlugin({
      template: resolveAppPath("public/index.html"),
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
