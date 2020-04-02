const { appPath } = require('./paths')
const { readJSONFileSync } = require('./read-json')
const signale = require('signale')

let app = {}

try {
  app = readJSONFileSync(appPath)
  app.appName = app.appName || app.name
} catch (error) {
  signale.warn('No `./app.json` Found')
}

module.exports = app
