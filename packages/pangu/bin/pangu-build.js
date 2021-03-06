// load env first
require('dotenv').config()
// apply NODE_ENV
process.env.NODE_ENV = 'production'
const program = require('commander')
const webpack = require('webpack')
const webpackConfig = require('./config/webpack')
const signale = require('signale')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const printBuildError = require('react-dev-utils/printBuildError')
const updateNotifier = require('update-notifier')
const pkg = require('../package.json')

// notify for update
updateNotifier({ pkg }).notify()

/**
 * Usage
 */
program
  .usage('[options]')
  .option('-a,--ana', 'start webpack bundle analyzer')
  .option('--ts-check', 'check typescript')
  .parse(process.argv)

const compiler = webpack(webpackConfig)

// create compiler
compiler.run((err, stats) => {
  let messages
  // normal error from process
  if (err) {
    let errMessage = err.message

    if (errMessage) {
      // Add additional information for postcss errors
      if (Object.prototype.hasOwnProperty.call(err, 'postcssNode')) {
        errMessage +=
          '\nCompileError: Begins at CSS selector ' + err.postcssNode.selector
      }

      messages = formatWebpackMessages({
        errors: [errMessage],
        warnings: [],
      })
    }
  } else {
    const { errors = [], warnings = [] } = stats.toJson({
      all: false,
      warnings: true,
      errors: true,
    })
    messages = formatWebpackMessages({
      errors: errors.map(({ message }) => message),
      warnings: warnings.map(({ message }) => message),
    })
  }

  if (messages.errors.length) {
    // Only keep the first error. Others are often indicative
    // of the same problem, but confuse the reader with noise.
    if (messages.errors.length > 1) {
      messages.errors.length = 1
    }
    messages = messages.errors.join('\n\n')
  }

  if (stats) {
    if (stats.hasErrors()) {
      const tscCompileOnError = process.env.TSC_COMPILE_ON_ERROR === 'true'
      if (tscCompileOnError) {
        signale.error(
          'Compiled with the following type errors (you may want to check these before deploying your app):\n'
        )
        printBuildError(messages)
      } else {
        signale.error('Failed to compile.\n')
        printBuildError(messages)
        process.exit(1)
      }
    } else if (stats.hasWarnings()) {
      signale.warn('Compiled with warnings.\n')
      console.log(messages.warnings.join('\n\n'))
    } else {
      signale.success('Compiled successfully.\n')
    }
  }

  compiler.close(() => {})
})
