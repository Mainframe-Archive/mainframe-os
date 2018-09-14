module.exports = function(api) {
  return api.env('test')
    ? {
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                node: 'current',
              },
              modules: 'commonjs',
            },
          ],
          '@babel/preset-flow',
        ],
      }
    : {}
}
