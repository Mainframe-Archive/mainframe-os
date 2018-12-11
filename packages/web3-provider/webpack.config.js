const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'web3-provider.production.js',
    library: 'MFWeb3Provider',
    libraryTarget: 'umd',
  },
  module: {
    rules: [{ test: /\.js$/, use: 'babel-loader' }],
  },
}
