const path = require('path')
const fs = require('fs')

// working directory
const workDir = process.cwd()

// source directory
const srcDir = path.resolve(workDir, 'src')

// mock directory
const mockDir = path.resolve(workDir, 'mocks')

// public assets dir
const publicDir = path.resolve(srcDir, 'public')

// build output dir
const outputDir = path.resolve(workDir, 'build')

// package.json path
const pkgPath = path.resolve(workDir, 'package.json')

// app config path
const appPath = path.resolve(workDir, 'app.json')

// theme config path
const themePath = path.resolve(workDir, 'theme.json')

// template path
let tpl = path.resolve(publicDir, 'index.ejs') // default

// 兼容
if (fs.existsSync(path.resolve(srcDir, 'index.ejs'))) {
  tpl = path.resolve(srcDir, 'index.ejs')
} else if (fs.existsSync(path.resolve(publicDir, 'index.ejs'))) {
  tpl = path.resolve(publicDir, 'index.ejs')
}

const tplPath = tpl

const publicPath = process.env.PUBLIC_PATH || '/'

module.exports = {
  workDir,
  srcDir,
  pkgPath,
  appPath,
  tplPath,
  mockDir,
  themePath,
  publicDir,
  outputDir,
  publicPath,
}
