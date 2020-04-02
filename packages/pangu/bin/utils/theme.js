const { themePath } = require('./paths')
const { readJSONFileSync } = require('./read-json')
const signale = require('signale')

let theme = {}

try {
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
} catch (error) {
  signale.info('No `./theme.json` Found')
}

module.exports = theme
