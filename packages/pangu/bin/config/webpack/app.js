const { existsSync } = require('fs')
const { resolve } = require('path')
const { workDir } = require('../../utils/paths')

module.exports = (() => {
  const paths = ['webpack.config.js', 'config/webpack.config.js']
  let webpackPath = ''

  for (let i = 0; i < paths.length; i++) {
    const filePath = resolve(workDir, paths[i])
    if (existsSync(filePath)) {
      webpackPath = filePath
      break
    }
  }
  if (webpackPath) {
    return require(webpackPath)
  } else {
    return {}
  }
})()
