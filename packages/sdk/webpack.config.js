const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'index.js',
    library: 'MainframeSDK',
    libraryTarget: 'umd',
  },
  module: {
    rules: [{ test: /\.js$/, use: 'babel-loader' }],
  },
}
