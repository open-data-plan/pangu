const app = require('../utils/app')
const pkg = require('../utils/pkg')

const appVersion = (process.env.APP_VERSION || pkg.version).trim()

const globalVars = {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  'process.env.APP_ENV': JSON.stringify(process.env.APP_ENV),
  'process.env.APP_VERSION': JSON.stringify(appVersion),
  'process.env.APP_NAME': JSON.stringify(app.appName),
}

Object.keys(process.env).map(key => {
  if (!(`process.env.${key}` in globalVars)) {
    globalVars[`process.env.${key}`] = JSON.stringify(process.env[key])
  }
})

module.exports = globalVars
