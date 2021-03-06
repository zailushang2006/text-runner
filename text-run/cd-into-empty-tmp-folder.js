const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const uuid = require('uuid/v4')
const debug = require('debug')('text-runner:cd-into-empty-tmp-folder')

module.exports = async function(args) {
  const existingDir = process.cwd()
  debug('remembering existing dir: ' + existingDir)
  global.cdHistory = existingDir
  const newFolder = path.join(os.tmpdir(), uuid())
  await fs.mkdir(newFolder)
  args.formatter.log('cd ' + newFolder)
  process.chdir(newFolder)
}
