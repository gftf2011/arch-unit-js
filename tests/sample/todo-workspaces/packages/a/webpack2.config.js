const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = [
  {
    name: 'app',
    entry: './main/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      clean: true,
    },
    resolve: {
      extensions: ['.js'],
      alias: {
        '@domain': path.resolve(__dirname, 'domain'),
        '@usecases': path.resolve(__dirname, 'use-cases'),
        '@infra': path.resolve(__dirname, 'infra'),
        '@main': path.resolve(__dirname, 'main'),
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      ],
    },
    plugins: [new HtmlWebpackPlugin({ template: './index.html' })],
    devServer: {
      static: path.resolve(__dirname, 'dist'),
      port: 5173,
      historyApiFallback: true,
    },
  },
];
