// @flow

const { red } = require('chalk')
const cliCursor = require('cli-cursor')
const endChildProcesses = require('end-child-processes')
const parseCliArgs = require('./parse-cli-args')
const textRunner = require('../text-runner')
const printCodeFrame = require('../helpers/print-code-frame')
const UnprintedUserError = require('../errors/unprinted-user-error.js')
const UserError = require('../errors/user-error.js')

cliCursor.hide()

async function main () {
  var exitCode = 0
  try {
    const cliArgs = parseCliArgs(process.argv)
    await textRunner(cliArgs)
  } catch (err) {
    exitCode = 1
    if (err instanceof UnprintedUserError) {
      console.log(red(err))
      printCodeFrame(console.log, err.filePath, err.line)
    } else if (!(err instanceof UserError)) {
      console.log(err.stack)
    }
  }
  endChildProcesses()
  process.exit(exitCode)
}

main()
