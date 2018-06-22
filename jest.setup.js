// Shared utility functions injected for tests

const join = require('path').join
const tmpdir = require('os').tmpdir()

global.getFixture = (dir, name) => join(dir, '__fixtures__', name)

global.getTempFile = name => join(tmpdir, 'js-mainframe-tests', name)
