// @flow

import type { Command } from '../command.js'

const { bold, dim, red } = require('chalk')
// $FlowFixMe: flow doesn't like requiring such an untyped file
const version: number = require('../../../package.json').version

class HelpCommand implements Command {
  error: string

  constructor (value: { error: string }) {
    this.error = value.error
  }

  async run () {
    console.log(this._template(this.error))
  }

  _template (error: string) {
    if (this.error) error = `${red(bold('Error: ' + error))}`
    return `
${dim('TextRunner ' + version)}
${error || ''}
USAGE: ${bold('text-run [<options>] <command>')}

COMMANDS
  ${bold(
    'run'
  )} [<filename>]  tests the entire documentation, or only the given file/folder
  ${bold('add')} <filename>    scaffolds a new block type handler
  ${bold('setup')}             creates an example configuration file
  ${bold('version')}           shows the currently installed version
  ${bold('help')}              shows this help screen

OPTIONS
  ${bold('--offline')}         don't check external links
`
  }
}

module.exports = HelpCommand
