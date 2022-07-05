var path = require("path");
var webpack = require("webpack");

var srcPath = path.join(__dirname, "src");
var appEnv = require("./env/" + (process.env.LOGS_VIEWER_ENV || "local") + ".js");

module.exports = {
    mode: "production",
    // optimization: {
    //     minimize: true //Update this to true or false
    // },
    entry: [
        "./src/index.jsx",
    ],

    module: {
        rules: [
            {
                test: /\.[tj]sx?$/,
                include: srcPath,
                use: ["awesome-typescript-loader"],
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

    node: false,
};
