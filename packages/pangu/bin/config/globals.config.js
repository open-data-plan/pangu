const app = require('../utils/app')
const pkg = require('../utils/pkg')
const dotenv = require('dotenv')

const envConfig = dotenv.config()

const appVersion = (process.env.APP_VERSION || pkg.version).trim()

const globalVars = {
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  'process.env.APP_ENV': JSON.stringify(process.env.APP_ENV),
  'process.env.APP_VERSION': JSON.stringify(appVersion),
  'process.env.APP_NAME': JSON.stringify(app.appName),
}

if (!envConfig.error) {
  const { parsed } = envConfig
  Object.keys(parsed).entries(([key, value]) => {
    if (!(`process.env.${key}` in globalVars)) {
      globalVars[`process.env.${key}`] = JSON.stringify(value)
    }
  })
}

module.exports = globalVars
