module.exports = {
  collectCoverage: true,
  reporters: ['default', 'jest-junit'],
  transformIgnorePatterns: ['node_modules/(?!@mainframe)'],
}
