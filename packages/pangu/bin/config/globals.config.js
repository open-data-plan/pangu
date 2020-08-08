const app = require('../utils/app')
const pkg = require('../utils/pkg')
const dotenv = require('dotenv')

dotenv.config()

const appVersion = (process.env.APP_VERSION || pkg.version).trim()

const globalVars = {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  'process.env.APP_ENV': JSON.stringify(process.env.APP_ENV),
  'process.env.APP_VERSION': JSON.stringify(appVersion),
  'process.env.APP_NAME': JSON.stringify(app.appName),
  'process.env.DYNAMIC_THEME': app.dynamicTheme,
}

Object.keys(process.env).forEach((key) => {
  if (!(`process.env.${key}` in globalVars)) {
    const value = process.env[key]
    globalVars[`process.env.${key}`] = JSON.stringify(value)
  }
})

module.exports = globalVars
