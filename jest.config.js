module.exports = {
  bail: true,
  collectCoverage: true,
  setupFiles: ['./jest.setup.js'],
  testEnvironment: 'node',
  transformIgnorePatterns: ['node_modules/(?!@mainframe)'],
  testPathIgnorePatterns: ['/test/'],
}
