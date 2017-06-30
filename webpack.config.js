var path = require("path");
var webpackMerge = require("webpack-merge");
var webpack = require("webpack");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var HtmlWebpackTemplate = require("html-webpack-template");
var distPath = path.join(__dirname, "dist");
var srcPath = path.join(__dirname, "src");
var modulePath = path.join(__dirname, "node_modules");

var appEnv = require("./env/" + (process.env.LOGS_VIEWER_ENV || "local") + ".js");

var common = {
  output: {
    path: distPath,
    publicPath: "/",
    filename: "embeded-viewer.js",
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".css", ".scss", ".png", ".jpg", ".svg", ".ico"],
  },

  devtool: "eval-source-map",

  module: {
    rules: [
      {
        test: /\.scss$/,
        include: srcPath,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader?importLoaders=2" },
          { loader: "sass-loader" },
          { loader: "postcss-loader" }
        ]
      },
      {
        test: /\.css$/,
        include: srcPath,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader"
        ]
      },
      {
        test: /\.less$/,
        include: modulePath,
        use: ["less-loader"],
      },
      {
        test: /\.(png|jpg|svg|ico)$/,
        include: srcPath,
        use:["file-loader"],
      },
      {
        test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/,
        use: ["url-loader?limit=10000&mimetype=application/font-woff&name=./assets/[hash].[ext]"]
      }
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: HtmlWebpackTemplate,
      title: "Retraced - Logs",
      appMountId: "app",
      mobile: true,
      externals: {
        "react": "React",
        "react-dom": "ReactDOM",
      },
      scripts: appEnv.WEBPACK_SCRIPTS,
      inject: false,
      window: {
        env: appEnv,
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(appEnv.ENVIRONMENT),
      }
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          require("autoprefixer")
        ]
      },
    }),
  ],
};

module.exports = function (env) {
  if (process.env.LOGS_VIEWER_ENV === "dev" || !process.env.LOGS_VIEWER_ENV) {
    var dev = require("./webpack.config.dev");
    return webpackMerge(common, dev);
  } else {
    var dist = require("./webpack.config.dist");
    return webpackMerge(common, dist);
  }
};
