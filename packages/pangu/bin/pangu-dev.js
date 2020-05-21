// load env first
require('dotenv').config()

// apply NODE_ENV
process.env.NODE_ENV = 'development'

const program = require('commander')
const { checkBrowsers } = require('react-dev-utils/browsersHelper')
const { choosePort } = require('react-dev-utils/WebpackDevServerUtils')
const signale = require('signale')
const chokidar = require('chokidar')
const { themePath, appPath, tplPath } = require('./utils/paths')
const { fork } = require('child_process')
const updateNotifier = require('update-notifier')
const pkg = require('../package.json')

// notify for update
updateNotifier({ pkg }).notify()

/**
 * Usage
 */
program
  .usage('[options]')
  .option('-i, --ip [ip]', 'host to use')
  .option('-p, --port [port]', 'port to use')
  .parse(process.argv)

const DEFAULT_PORT = parseInt(program.port || process.env.PORT, 10) || 3000
const HOST = program.ip || process.env.HOST || '0.0.0.0'

const isInteractive = process.stdout.isTTY

signale.start('Starting the development server...\n')

checkBrowsers(process.cwd(), isInteractive)
  .then(() => {
    return choosePort(HOST, DEFAULT_PORT)
  })
  .then((port) => {
    if (!port) {
      return null
    }

    let child = start(port, HOST)

    const fileWatcher = chokidar.watch([themePath, appPath, tplPath], {
      ignored: /(^|[/\\])\../, // ignore dotfiles
      persistent: true,
      ignoreInitial: true,
    })
    fileWatcher.on('all', (event, path) => {
      signale.await('Config file changed, restart dev server...')
      signale.info(`Changed file: ${path}`)
      child.kill()
      child = start(port, HOST)
    })
  })
  .catch((err) => {
    if (err && err.message) {
      console.log(err.message)
    }
    process.exit(1)
  })

function start(port, host) {
  const child = fork(
    require.resolve('./server/index.js'),
    ['--port', port, '--host', host],
    {
      stdio: 'inherit',
    }
  )
  ;[('SIGINT', 'SIGTERM')].forEach(function (sig) {
    process.on(sig, function () {
      child.kill(sig)
      process.exit()
    })
  })

  child.on('error', (code) => {
    process.exit(1)
  })

  return child
}
