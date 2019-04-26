const path = require('path')

module.exports = {
  mode: 'production',
  target: 'electron-renderer',
  entry: './static/preload.js',
  output: {
    path: path.resolve(__dirname, 'static'),
    filename: 'preload.bundle.js',
  },
}
