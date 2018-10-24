const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'mainframe.production.js',
    library: 'MainframeWeb3',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      { test: /\.js/, use: 'babel-loader' },
      { test: /\.json$/, loader: 'json-loader' },
    ],
  },
}
