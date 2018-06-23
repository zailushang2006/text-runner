// @flow

import type { CliArgTypes } from './cli-arg-types.js'

const availableCommands = require('../commands/available-commands')
const minimist = require('minimist')
const path = require('path')

// Parses the command-line options received,
// and returns them structured as the command to run and options
module.exports = function (argv: string[]): CliArgTypes {
  // remove optional unix node call
  if (path.basename(argv[0] || '') === 'node') {
    argv.splice(0, 1)
  }

  // remove optional windows node call
  if (path.win32.basename(argv[0] || '') === 'node.exe') {
    argv.splice(0, 1)
  }

  // remove optional linux text-run call
  if (path.basename(argv[0] || '') === 'text-run') {
    argv.splice(0, 1)
  }

  // remove optional Windows CLI call
  if (argv[0] && argv[0].endsWith('dist\\cli\\cli.js')) {
    argv.splice(0, 1)
  }

  const result = minimist(argv, { boolean: 'offline' })
  const commands = result._ || []
  delete result._

  // extract command
  let command = ''
  if (availableCommands().includes(commands[0])) {
    command = commands[0]
    commands.splice(0, 1)
  } else {
    command = 'run'
  }
  result.command = command
  result.files = commands[0]

  // $FlowFixMe
  return result
}
