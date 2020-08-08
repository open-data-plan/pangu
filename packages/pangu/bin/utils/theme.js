const { themePath, themeCfgPath } = require('./paths')
const { readJSONFileSync } = require('./read-json')
const signale = require('signale')
const fs = require('fs')

let theme = {}

try {
  if (fs.existsSync(themeCfgPath)) {
    theme = require(themeCfgPath)
  } else if (fs.existsSync(themePath)) {
    theme = readJSONFileSync(themePath)
    if (theme.extends) {
      try {
        let extend = require(theme.extends)
        if (extend.default) {
          extend = extend.default
        }
        delete theme.extends
        theme = {
          ...extend,
          ...theme,
        }
      } catch (error) {
        signale.error(error)
      }
    }
  }
} catch (error) {}

module.exports = theme
