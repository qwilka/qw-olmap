// this file is run from the root directory of the project
// npm run build:olmap 
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: './olmap/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../build/olmap'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./olmap/index.html", to: "index.html" },
        { from: "./data/favicon.ico", to: "favicon.ico" },
      ],
    }),
  ],
};