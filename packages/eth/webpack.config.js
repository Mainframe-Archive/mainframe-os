const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'EthClient.js',
    library: 'EthClient',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      { test: /\.js/, use: 'babel-loader' },
      { test: /\.json$/, loader: 'json-loader' },
    ],
  },
}
