const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware')
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware')
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware')
const ignoredFiles = require('react-dev-utils/ignoredFiles')
const { srcDir, publicDir } = require('../utils/paths')

const publicPath = (process.env.PUBLIC_PATH || '/').trim()

module.exports = (host, port) => ({
  port,
  host,
  publicPath,
  quiet: true,
  compress: true,
  noInfo: true,
  hot: true,
  overlay: false,
  disableHostCheck: true,
  clientLogLevel: 'none',
  contentBase: publicDir,
  // By default files from `contentBase` will not trigger a page reload.
  watchContentBase: true,
  // useLocalIp: true,
  watchOptions: {
    ignored: ignoredFiles(srcDir),
  },
  // Use 'ws' instead of 'sockjs-node' on server since we're using native
  // websockets in `webpackHotDevClient`.
  transportMode: 'ws',
  // Prevent a WS client from getting injected as we're already including
  // `webpackHotDevClient`.
  injectClient: false,
  historyApiFallback: true,
  stats: {
    colors: true,
    chunks: false,
    chunkModules: false,
    modules: false,
    entrypoints: false,
    children: false,
    version: false,
    assets: false,
  },
  before(app, server) {
    // This lets us fetch source contents from webpack for the error overlay
    app.use(evalSourceMapMiddleware(server))
    // This lets us open files from the runtime error overlay.
    app.use(errorOverlayMiddleware())
  },
  after(app) {
    // This service worker file is effectively a 'no-op' that will reset any
    // previous service worker registered for the same host:port combination.
    // We do this in development to avoid hitting the production cache if
    // it used the same host and port.
    // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
    app.use(noopServiceWorkerMiddleware(publicPath))
  },
})
