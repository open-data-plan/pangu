// load env first
require('dotenv').config()

// apply NODE_ENV
process.env.NODE_ENV = 'development'

const program = require('commander')
const { checkBrowsers } = require('react-dev-utils/browsersHelper')
const { choosePort } = require('react-dev-utils/WebpackDevServerUtils')
const signale = require('signale')
const chokidar = require('chokidar')
const { themePath, appPath, tplPath, envPath } = require('./utils/paths')
const { fork } = require('child_process')
const updateNotifier = require('update-notifier')
const pkg = require('../package.json')
const { argv } = require('yargs')

// notify for update
updateNotifier({ pkg }).notify()

/**
 * Usage
 */
program
  .usage('[options]')
  .option('-i, --ip [ip]', 'host to use')
  .option('-p, --port [port]', 'port to use')
  .option('--ts-check', 'check typescript')
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

    start(port, HOST)
  })
  .catch((err) => {
    if (err && err.message) {
      console.log(err.message)
    }
    process.exit(1)
  })

function start(port, host) {
  const args = ['--port', port, '--host', host]
  if (argv.tsCheck) {
    args.push('--ts-check')
  }
  const child = fork(require.resolve('./server/index.js'), args, {
    stdio: 'inherit',
  })

  const fileWatcher = chokidar.watch([themePath, appPath, tplPath, envPath], {
    persistent: true,
    ignoreInitial: true,
  })

  fileWatcher.on('all', (event, path) => {
    signale.await('Config file changed, restart dev server...')
    signale.info(`Changed file: ${path}`)
    child.kill()
    start(port, HOST)
  })

  process.stdin.on('data', (buf) => {
    const message = buf.toString('utf8').trim()

    if (message === 'rs' || message === 'restart') {
      signale.note('Restart development server')
      child.kill()
      start(port, host)
    }
  })

  child.on('error', (code) => {
    process.exit(1)
  })
  ;[('SIGINT', 'SIGTERM')].forEach(function (sig) {
    process.on(sig, function () {
      child.kill(sig)
      process.exit()
    })
  })

  return child
}
