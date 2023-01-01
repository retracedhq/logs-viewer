var path = require("path");
const { merge } = require("webpack-merge");
var webpack = require("webpack");
var distPath = path.join(__dirname, "dist");
var srcPath = path.join(__dirname, "src");
var modulePath = path.join(__dirname, "node_modules");

var appEnv = require("./env/" +
  (process.env.LOGS_VIEWER_ENV || "local") +
  ".js");

var common = {
  output: {
    path: distPath,
    filename: "index.js",
    libraryTarget: "umd",
    library: "RetracedEventsBrowser",
  },

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

  resolve: {
    extensions: [
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
      ".css",
      ".scss",
      ".png",
      ".jpg",
      ".svg",
      ".ico",
    ],
  },

  devtool: "source-map",

  module: {
    rules: [
      {
        test: /\.scss$/,
        include: srcPath,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "resolve-url-loader" },
          { loader: "sass-loader" },
          { loader: "postcss-loader" },
        ],
      },
      {
        test: /\.css$/,
        include: srcPath,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        include: modulePath,
        use: ["less-loader"],
      },
      {
        test: /\.(png|jpg|ico)$/,
        include: srcPath,
        use: ["file-loader"],
      },
      {
        test: /\.svg/,
        include: srcPath,
        use: ["svg-url-loader"],
      },
      {
        test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          "url-loader?limit=10000&mimetype=application/font-woff&name=./assets/[hash].[ext]",
        ],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(appEnv.RETRACED_ENV),
      },
    }),
    // new CopyWebpackPlugin({
    //     patterns: [{ from: "./src/assets/logs_spritesheet.svg" }]
    // }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [require("autoprefixer")],
      },
    }),
  ],
};

module.exports = function (env) {
  if (process.env.LOGS_VIEWER_ENV === "dev") {
    var dev = require("./webpack.config.dev");
    return merge(common, dev);
  } else {
    var dist = require("./webpack.config.dist");
    return merge(common, dist);
  }
};
