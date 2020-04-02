const fs = require('fs')
const { promisify } = require('util')

const readJSONFile = async file => {
  if (!file) {
    throw new Error('Invalid File Path')
  }

  const fileContent = await promisify(fs.readFile)(file, 'utf8')
  if (!fileContent) {
    return {}
  }
  const data = JSON.parse(fileContent)
  return data
}

const readJSONFileSync = file => {
  if (!file) {
    throw new Error('Invalid File Path')
  }

  const fileContent = fs.readFileSync(file, 'utf8')
  return JSON.parse(fileContent)
}

module.exports.readJSONFile = readJSONFile
module.exports.readJSONFileSync = readJSONFileSync
