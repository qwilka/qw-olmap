const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackCdnPlugin = require('webpack-cdn-plugin');

// const webpack = require('webpack');
//   new webpack.ProvidePlugin({
//     "window.L": "leaflet"
//   }),

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  entry: path.join(__dirname, 'src/index.js'),
  mode,
  output: {
    path: path.join(__dirname, 'qwol'),
    publicPath: '/qwol',
    filename: 'qwol.js',
  },
  module: {
    rules: [
        { test: /\.css$/, use: ['style-loader', 'css-loader'] }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({ 
      filename: './index.html',
      template: "./src/index.html"
    }), // output file relative to output.path
    new WebpackCdnPlugin({
      modules: [

      ],
      publicPath: '/node_modules', // override when prod is false
    }),
  ],
};