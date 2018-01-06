// @flow

import type {CliArgTypes} from '../cli/cli-arg-types.js'
import type {ConfigFileStructure} from './config-file-structure.js'

const fs = require('fs')
const debug = require('debug')('textrun:configuration')
const YAML = require('yamljs')

const defaultValues = {
  fast: false,
  files: '**/*.md',
  format: 'detailed',
  useTempDirectory: false,
  classPrefix: 'tr_',
  activityTypes: {
    runConsoleCommand: {
      globals: {}
    }
  }
}

// Encapsulates logic around the configuration
class Configuration {
  configFilePath: string
  constructorArgs: CliArgTypes
  fileData: ConfigFileStructure
  sourceDir: string
  testDir: string

  constructor (configFilePath: string, constructorArgs: CliArgTypes) {
    this.configFilePath = configFilePath
    this.constructorArgs = constructorArgs || {}

    if (this.configFilePath) {
      debug(`loading configuration file: ${this.configFilePath}`)
      // $FlowFixMe: flow-type defs seems to be wrong here
      this.fileData = YAML.load(configFilePath) || {}
    } else {
      this.fileData = {}
    }
    debug(`configuration file data: ${JSON.stringify(this.fileData)}`)

    // the directory containing the source code
    this.sourceDir = process.cwd()
  }

  // Returns the value of the attribute with the given name
  get (attributeName :string) :string {
    return this.constructorArgs[attributeName] || this.fileData[attributeName] || defaultValues[attributeName]
  }

  // Creates a config file with default values
  createDefault () {
    fs.writeFileSync('./text-run.yml',
`# white-list for files to test
files: '**/*.md'

# the formatter to use
format: detailed

# prefix that makes anchor tags active regions
classPrefix: 'tr_'

# whether to run the tests in an external temp directory,
# uses ./tmp if false,
# you can also provide a custom directory path here
useTempDirectory: false

# activity-type specific configuration
activityTypes:
  runConsoleCommand:
    globals: {}`)
  }
}

module.exports = Configuration