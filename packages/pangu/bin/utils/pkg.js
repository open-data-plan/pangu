const { pkgPath } = require('./paths')
const { readJSONFileSync } = require('./read-json')

const pkg = readJSONFileSync(pkgPath)

module.exports = pkg
