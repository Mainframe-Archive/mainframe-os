module.exports = {
  collectCoverage: true,
  reporters: ['default', 'jest-junit'],
  setupFiles: ['./jest.setup.js'],
  testEnvironment: 'node',
  transformIgnorePatterns: ['node_modules/(?!@mainframe)'],
}
