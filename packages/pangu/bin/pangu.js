#!/usr/bin/env node

const program = require('commander')
const updateNotifier = require('update-notifier')
const pkg = require('../package.json')

// notify for update
updateNotifier({ pkg }).notify()

/**
 * Usage
 */
program
  .version(pkg.version)
  .description('pangu develop tool')
  .usage('<command> [options]')
  .command('start', 'simulate the production environment')
  .command('dev', 'start a server with HMR in local')
  .command('build', 'build dist files for production')
  .command('unit', 'run unit test')
  .command('e2e', 'run e2e test')
  .command('mock', 'start a mock server in local')
  .parse(process.argv)
