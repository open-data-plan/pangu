#!/usr/bin/env node

const program = require('commander')
const fs = require('fs')
const path = require('path')
const isEqual = require('lodash/isEqual')
const enableDestroy = require('server-destroy')
const signale = require('signale')
const clearConsole = require('react-dev-utils/clearConsole')
const { mockDir } = require('./utils/paths')
const updateNotifier = require('update-notifier')
const pkg = require('../package.json')

// notify for update
updateNotifier({ pkg }).notify()

/**
 * Usage
 */
program
  .usage('[options]')
  .option('-p, --port', 'Mock server port, default is 9000')
  .option('-w, --watch', 'Watch db.json change, default is false')
  .parse(process.argv)

// padding
console.log()

// options
const port = +program.args[0] || 9000
const watch = program.watch

// must require in here
const createServer = require('./config/mock-server.config')
const dbPath = path.resolve(mockDir, 'db.json')

// start server
let app
let db

const start = () => {
  db = JSON.parse(fs.readFileSync(dbPath, { encoding: 'utf8' }))
  app = createServer().listen(port, () => {
    signale.info(`Mock Server now running at http://0.0.0.0:${port}\n`)
  })
  enableDestroy(app)
}

start()

// from https://github.com/typicode/json-server/blob/master/src/cli/run.js#L199
if (watch) {
  signale.info('Watching database...\n')
  let readError = false
  fs.watch(mockDir, (event, file) => {
    if (file) {
      const watchedFile = path.resolve(mockDir, file)
      if (watchedFile === dbPath) {
        let obj
        try {
          obj = JSON.parse(fs.readFileSync(watchedFile, { encoding: 'utf8' }))
          if (readError) {
            signale.info(`Read error has been fixed :)\n`)
            readError = false
          }
        } catch (e) {
          readError = true
          signale.error(`Error reading ${watchedFile}\n`)
          console.error(e.message)
          return
        }

        // Compare .json file content with in memory database
        const isDatabaseDifferent = !isEqual(obj, db)
        if (isDatabaseDifferent) {
          clearConsole()
          signale.info(`database has changed, reloading...\n`)
          app && app.destroy()
          start()
        }
      }
    }
  })
}
