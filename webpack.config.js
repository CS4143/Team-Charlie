const path = require('path');
module.exports = {
  context: __dirname + '/CurrentProject',
  entry: {
    request: './request.es6.js'
  },
  // mode: 'production',
  output: {
    path: __dirname + '/CurrentProject',
    filename: 'request.js'
  },
  devServer: {
    historyApiFallback: true,
    host: '127.0.0.1', //
    port: 18080,
  },
  module: {
    rules: [
      {
        test: /\.js$/, exclude: /(node_modules|bower_components)/, use: {
          loader: 'babel-loader',
          options:
          {
            presets: ['@babel/preset-env'],
            plugins: ["@babel/plugin-transform-runtime"]
          }

        }
      },
    ]
  }
};