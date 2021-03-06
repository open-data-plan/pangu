const { merge } = require('webpack-merge')
const baseConfig = require('./base')
const appConfig = require('./app')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { tplPath } = require('../../utils/paths')
const app = require('../../utils/app')

const PRODUCT = process.env.NODE_ENV === 'production'

const config =
  typeof appConfig === 'function'
    ? appConfig(baseConfig)
    : merge(baseConfig, appConfig)

if (config.entry) {
  const entry = config.entry

  if (typeof entry === 'object' && Object.keys(entry).length > 1) {
    const entries = Object.keys(entry)

    entries.forEach((name, index) => {
      config.plugins.push(
        new HtmlWebpackPlugin({
          filename: `${index === 0 ? 'index' : name}.html`,
          template: tplPath,
          title: app.appName || '',
          chunks: [name],
          hash: false,
          inject: true,
          minify: {
            collapseWhitespace: PRODUCT,
            minifyJS: PRODUCT,
          },
        })
      )
    })
  } else {
    config.plugins.push(
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: tplPath,
        title: app.appName || '',
        hash: false,
        inject: true,
        minify: {
          collapseWhitespace: PRODUCT,
          minifyJS: PRODUCT,
        },
      })
    )
  }
}

module.exports = config
