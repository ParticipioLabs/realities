const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  target: 'node',
  node: {
    __dirname: true,
    __filename: true,
  },
  devtool: 'source-map',
  output: {
    publicPath: path.join(__dirname, 'build'),
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js'
  },
  externals: [nodeExternals()],
  plugins: [
    new webpack.BannerPlugin({
      banner: 'require("source-map-support").install();',
      raw: true,
      entryOnly: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          emitWarning: true,
        },
      },
    ],
  },
};
