const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const {InjectManifest} = require('workbox-webpack-plugin');

module.exports = {
  entry: {
    main: path.resolve(__dirname, './src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, './vnol'),
    publicPath: '/vnol/',
    filename: 'build.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'TESTING vn-ol',
      template: path.resolve(__dirname, './src/template.html'), // template file
      filename: 'index.html', // output file
    }),
    new CleanWebpackPlugin(),
    new InjectManifest({
      swSrc: './src/sw.js',
      swDest: 'sw.js',
      include: [
        /\.html$/,
        /\.js$/,
        /\.css$/,
        /\.woff2$/,
        /\.jpg$/,
        /\.png$/
      ],
      additionalManifestEntries: [
//        {url:'/assets/vn-icon-152.png', revision:null},
        {url:'/assets/favicon.ico', revision:null}                
      ]
    })
  ],
  module: {
    rules: [
      // JavaScript
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}


// https://developers.google.com/web/tools/workbox/modules/workbox-precaching#explanation_of_the_precache_list
