process.env.NODE_ENV = 'development'

const { argv } = require('yargs')
const WebpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const clearConsole = require('react-dev-utils/clearConsole')
const openBrowser = require('react-dev-utils/openBrowser')
const {
  createCompiler,
  prepareUrls,
} = require('react-dev-utils/WebpackDevServerUtils')
const webpackConfig = require('../config/webpack.config')
const createServerConfig = require('../config/server.config')
const { name: appName } = require('../utils/pkg')

const { host, port } = argv

const isInteractive = process.stdout.isTTY

const serverConfig = createServerConfig(host, port)
const urls = prepareUrls('http', host, port)
const devSocket = {
  warnings: warnings =>
    devServer.sockWrite(devServer.sockets, 'warnings', warnings),
  errors: errors => devServer.sockWrite(devServer.sockets, 'errors', errors),
}

const compiler = createCompiler({
  appName,
  config: webpackConfig,
  urls,
  webpack,
  devSocket,
  useTypescript: true,
})
const devServer = new WebpackDevServer(compiler, serverConfig)
devServer.listen(port, host, err => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  if (isInteractive) {
    clearConsole()
  }
  devServer.middleware.waitUntilValid(() => {
    openBrowser(urls.localUrlForBrowser)
  })
})
;[('SIGINT', 'SIGTERM')].forEach(function(sig) {
  process.on(sig, function() {
    devServer.close()
    process.exit()
  })
})
