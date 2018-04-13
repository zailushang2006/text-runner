// @flow

import type Formatter from './formatters/formatter.js'
import type { CliArgTypes } from './cli/cli-arg-types.js'

const ActivityTypeManager = require('./commands/run/activity-type-manager.js')
const { red } = require('chalk')
const commandPath = require('./commands/command-path')
const Configuration = require('./configuration/configuration.js')
const FormatterManager = require('./formatters/formatter-manager')
const fs = require('fs')
const hasCommand = require('./commands/has-command')
const PrintedUserError = require('./errors/printed-user-error.js')
const UnprintedUserError = require('./errors/unprinted-user-error.js')

// Tests the documentation in the given directory
module.exports = async function (value: {
  command: string,
  file?: string,
  offline?: boolean,
  exclude?: string,
  format?: Formatter
}) {
  const configFileName = fs.existsSync('text-run.yml') ? 'text-run.yml' : ''
  const textRunner = new TextRunner(
    { offline: value.offline, exclude: value.exclude, format: value.format },
    configFileName
  )
  await textRunner.execute(value.command, value.file)
}

class TextRunner {
  constructorArgs: CliArgTypes
  configuration: Configuration
  formatter: Formatter
  activityTypesManager: ActivityTypeManager

  constructor (constructorArgs: CliArgTypes, configPath) {
    this.constructorArgs = constructorArgs
    this.configuration = new Configuration(configPath, this.constructorArgs)
    this.formatter = new FormatterManager().getFormatter(
      this.configuration.get('format')
    )
    this.activityTypesManager = new ActivityTypeManager(
      this.formatter,
      this.configuration
    )
  }

  // Tests the documentation according to the given command and arguments
  async execute (command: string, file?: string) {
    try {
      if (!hasCommand(command)) {
        throw new UnprintedUserError(`unknown command: ${red(command)}`)
      }
      const CommandClass = require(commandPath(command))
      await new CommandClass(this).run(file)
    } catch (err) {
      if (err instanceof UnprintedUserError) {
        this.formatter.error(err.message, err.filePath, err.line)
        throw new PrintedUserError(err)
      } else {
        throw err
      }
    }
  }
}
