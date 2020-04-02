const chalk = require('chalk')
const signale = require('signale')
const pkg = require('../../package.json')

/**
 * check node version
 */
const checkNode = () => {
  const nodeVersion = process.versions.node
  const major = nodeVersion.split('.')[0]

  if (major < 8) {
    signale.error(
      `You are running ${chalk.yellow(pkg.name)} on Node ${chalk.yellow(
        nodeVersion
      )}, need Node 8 or higher`
    )
    process.exit(1)
  }
}

module.exports = checkNode
