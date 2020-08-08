#!/usr/bin/env node

const program = require('commander')
const signale = require('signale')
const fs = require('fs')
const path = require('path')
// const lodash = require('lodash')
const inquirer = require('inquirer')
const chalk = require('chalk')
const decompress = require('decompress')
const https = require('https')
const { spawnSync } = require('child_process')
const { promisify } = require('util')
const ProgressBar = require('progress')
const getTemplate = require('./utils/template')
const checkNode = require('./utils/check-node')
const pkg = require('../package.json')
const format = require('string-template')

// padding
console.log()

program.on('exit', () => {
  console.log()
})

// check node first
checkNode()

let projectName
let dest

// init options
const options = [
  {
    name: 'Component',
    value: 'component',
    option: '-c, --component',
    des: 'create react component',
  },
  {
    name: 'Desktop',
    value: 'desktop',
    option: '-d, --desktop',
    des: 'create react desktop web project',
  },
  {
    name: 'Mobile',
    value: 'mobile',
    option: '-m, --mobile',
    des: 'create react mobile web project',
  },
  {
    name: 'Library',
    value: 'lib',
    option: '-l, --lib',
    des: 'create lib in typescript',
  },
]

program
  .version(pkg.version, '-v, --version')
  .arguments('<project-name>')
  .usage('<project-name> [options]')
  .action((name) => {
    projectName = name
  })

const initProjectTypes = []
const choices = options.map(({ name, value, setter, option, des }) => {
  program.option(option, des, null, false)
  initProjectTypes.push(value)
  return {
    name: des,
    short: name,
    value,
  }
})

program.parse(process.argv)

if (!projectName) {
  signale.error('You must present project name')
  process.exit(1)
}

const isMonoRepo = fs.existsSync(path.resolve(process.cwd(), 'lerna.json'))

const handleError = async (error) => {
  console.log()
  error && console.error(error)
  // clean dest directory
  await promisify(fs.rmdir)(dest)
  process.exit(1)
}

const unzipFile = async (zipFile, dest) => {
  try {
    await decompress(zipFile, dest, {
      strip: 1, // remove leading directory
    })
  } catch (error) {
    await handleError(error)
  }
}

const initGitRepo = () => {
  signale.pending('Initialize git repository\n')
  const isWin32 = process.platform === 'win32'
  const subProcess = spawnSync(isWin32 ? 'git.cmd' : 'git', ['init'], {
    stdio: 'inherit',
  })

  console.log()
  if (subProcess.status === 1) {
    signale.error('Initialize git repository failed')
  } else {
    signale.success('Initialize git repository success')
  }
}

const installPackage = () => {
  signale.pending('Install 📦 \n')

  const isWin32 = process.platform === 'win32'
  const subProcess = spawnSync(isWin32 ? 'npm.cmd' : 'npm', ['install'], {
    stdio: 'inherit',
  })

  console.log()
  if (subProcess.status === 1) {
    signale.error(
      '😕  There is something wrong 👆  when installing packages, you may need to install packages by yourself'
    )
  } else {
    signale.success('Done, coding now 👨‍💻‍!!!')
  }
}

const updatePkg = async (dest) => {
  const pkgPath = `${dest}/package.json`
  const readmePath = `${dest}/README.md`

  try {
    const pkgContent = await promisify(fs.readFile)(pkgPath, 'utf8')
    const pkg = JSON.parse(pkgContent)
    const pkgName = projectName.split('/').pop()
    console.log()
    const { name } = await inquirer.prompt({
      type: 'input',
      name: 'name',
      message: `name(${pkgName}):`,
      default: pkgName,
    })

    pkg.name = (name && name.trim()) || pkgName
    const defaultVersion = '0.0.0'
    const { version } = await inquirer.prompt({
      type: 'input',
      name: 'version',
      message: `version(${defaultVersion}):`,
      default: defaultVersion,
    })

    pkg.version = (version && version.trim()) || defaultVersion

    const defaultDes = pkg.description
    const { description } = await inquirer.prompt({
      type: 'input',
      name: 'description',
      message: `description(${defaultDes}):`,
      default: defaultDes,
    })

    pkg.description = (description && description.trim()) || defaultDes

    const pkgData = JSON.stringify(pkg, null, 2)

    const readme = await promisify(fs.readFile)(readmePath, {
      encoding: 'utf8',
    })

    await Promise.all([
      promisify(fs.writeFile)(pkgPath, pkgData),
      promisify(fs.writeFile)(readmePath, format(readme, pkg), {
        encoding: 'utf8',
      }),
    ])

    console.log()
    let shouldExecInstall = true
    if (isMonoRepo) {
      const { install } = await inquirer.prompt({
        type: 'confirm',
        name: 'install',
        message: 'Install packages now?',
        default: false,
      })
      shouldExecInstall = install
    }
    if (shouldExecInstall) {
      await installPackage()
    }
    process.exit(0)
  } catch (error) {
    await handleError(error)
  }
}

const downloadFiles = async (dest, template) => {
  const zipFileName = dest + '/temp.zip'
  const req = https.get(template, {
    headers: {
      'PRIVATE-TOKEN': '2TYVGhes2V78-kQ4XtDt',
    },
  })
  req.on('response', async (res) => {
    // broken
    if (res.statusCode >= 400) {
      signale.error(
        'There is something wrong with your network, maybe wrong branch name'
      )
      await handleError()
    }
    // follow redirect
    if (res.statusCode === 302) {
      const redirectUrl = res.headers.location
      if (redirectUrl) {
        downloadFiles(dest, redirectUrl)
        return
      } else {
        signale.error('No template found')
        await handleError()
      }
    }
    // length can be NaN, but no why
    let length = parseInt(res.headers['content-length'], 10)
    if (isNaN(length)) {
      length = 136483 // magic number
    }
    const bar = new ProgressBar(chalk.cyan('[:bar] :rate/bps :percent :etas'), {
      complete: '=',
      incomplete: '-',
      width: 20,
      total: length,
      clear: true,
    })

    res.on('data', (chunk) => {
      fs.appendFileSync(zipFileName, chunk)
      bar && bar.tick(chunk.length)
    })

    res.on('end', async () => {
      bar && bar.terminate()
      await unzipFile(zipFileName, dest)
      try {
        await promisify(fs.unlink)(zipFileName)
      } catch (error) {
        await handleError(error)
      }

      signale.success('Download success')
      process.chdir(dest)
      if (!isMonoRepo) {
        initGitRepo()
      }
      await updatePkg(dest)
    })
  })

  req.on('error', async (error) => {
    console.log(error)
    await handleError(error)
  })
}

const start = async () => {
  let projectType = initProjectTypes.find((type) => program[type])
  if (!projectType) {
    const { type } = await inquirer.prompt({
      type: 'list',
      name: 'type',
      message: 'What template do you want to use?',
      choices,
      default: 'desktop',
    })

    projectType = type
  }

  const packageName = projectName.split('/').pop()

  signale.info(
    `You are creating a ${chalk.yellow(
      projectType
    )} project named as ${chalk.yellow(packageName)}`
  )

  const template = getTemplate(projectType)

  if (!template) {
    signale.complete('Type not supported yet')
    process.exit(0)
  }

  let config = template.default
  if (isMonoRepo && template.lerna) {
    config = template.lerna
  } else {
    if (Object.keys(template).length > 1) {
      const { type } = await inquirer.prompt({
        type: 'list',
        name: 'type',
        message: 'What type of project do you want to create?',
        choices: Object.keys(template).map((key) => ({
          name: template[key].des,
          value: key,
        })),
        default: 'default',
      })
      config = template[type]
    } else {
      config = template.default
    }
  }

  dest = path.resolve(process.cwd(), projectName)

  if (fs.existsSync(dest)) {
    signale.error('Destination directory is not empty, please check!')
    process.exit(1)
  } else {
    await promisify(fs.mkdir)(dest)
  }

  await downloadFiles(dest, config.url)
}

start()
