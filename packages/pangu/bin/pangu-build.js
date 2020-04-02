// apply NODE_ENV first
process.env.NODE_ENV = 'production'

const program = require('commander')
const webpack = require('webpack')
const webpackConfig = require('./config/webpack.config')
const rimraf = require('rimraf')
const signale = require('signale')
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages')
const printBuildError = require('react-dev-utils/printBuildError')

/**
 * Usage
 */
program
  .usage('[options]')
  .option('-a,--ana', 'start webpack bundle analyzer')
  .option('-tc,--ts-check', 'check typescript')
  .parse(process.argv)

signale.info('Clean build output dir\n')
// clean dist first
rimraf.sync(`${webpackConfig.output.path}/*`)

const compiler = webpack(webpackConfig)

signale.info('Compile start')

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
    messages = formatWebpackMessages(
      stats.toJson({ all: false, warnings: true, errors: true })
    )
  }

  if (messages.errors.length) {
    // Only keep the first error. Others are often indicative
    // of the same problem, but confuse the reader with noise.
    if (messages.errors.length > 1) {
      messages.errors.length = 1
    }
    messages = messages.errors.join('\n\n')
  }

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
})
