const { expect } = require('chai')
const { setWorldConstructor } = require('cucumber')
const dimConsole = require('dim-console')
const flatten = require('array-flatten')
const fs = require('fs-extra')
const glob = require('glob')
const ObservableProcess = require('observable-process')
const path = require('path')
const uuid = require('uuid/v4')

const World = function () {
  // World provides step implementations that run and test TextRunner
  // via its command-line interface

  this.execute = async function (params) {
    var args = {}
    args.cwd = this.rootDir
    args.env = {}
    if (this.verbose) {
      args.stdout = dimConsole.process.stdout
      args.stderr = dimConsole.process.stderr
    } else {
      args.stdout = {
        write: text => {
          this.output += text
          return false
        }
      }
      args.stderr = {
        write: text => {
          this.output += text
          return false
        }
      }
    }
    if (this.debug) {
      args.env['DEBUG'] = '*,-babel'
    }

    if (process.env.NODE_ENV === 'coverage') {
      args.command = runWithTestCoverage(args.command)
    } else {
      args.command = this.makeFullPath(params.command)
    }
    this.process = new ObservableProcess(args)
    await this.process.waitForEnd()
    if (process.env.NODE_ENV === 'coverage') {
      storeTestCoverage()
    }
    if (this.verbose) {
      this.output = dimConsole.output
    }
    if (this.process.exitCode && !params.expectError) {
      console.log(this.output)
    }
  }

  this.makeFullPath = command => {
    if (/^text-run/.test(command)) {
      return command.replace(/^text-run/, this.fullTextRunPath())
    } else {
      return `${this.fullTextRunPath()} ${command}`
    }
  }

  this.fullTextRunPath = function () {
    var result = path.join(process.cwd(), 'bin', 'text-run')
    if (process.platform === 'win32') {
      result += '.cmd'
    }
    return result
  }

  this.verifyCallError = expectedError => {
    const output = this.process.fullOutput()
    expect(output).to.include(expectedError)
    expect(this.process.exitCode).to.equal(1)
  }

  this.verifyErrormessage = expectedText => {
    expect(this.process.fullOutput()).to.include(expectedText)
  }

  this.verifyFailure = table => {
    const output = this.process.fullOutput()
    var expectedHeader
    if (table.FILENAME && table.LINE) {
      expectedHeader = `${table.FILENAME}:${table.LINE}`
    } else if (table.FILENAME) {
      expectedHeader = `${table.FILENAME}`
    } else {
      expectedHeader = ''
    }
    if (table['MESSAGE']) {
      expectedHeader += ` -- ${table['MESSAGE']}`
    }
    expect(output).to.include(expectedHeader)
    expect(output).to.match(new RegExp(table['ERROR MESSAGE']))
    expect(this.process.exitCode).to.equal(
      parseInt(table['EXIT CODE']),
      'exit code'
    )
  }

  this.verifyOutput = table => {
    var expectedText = ''
    if (table.FILENAME) expectedText += table.FILENAME
    if (table.FILENAME && table.LINE) expectedText += `:${table.LINE}`
    if (table.FILENAME && (table.MESSAGE || table.WARNING)) {
      expectedText += ' -- '
    }
    if (table.MESSAGE) expectedText += table.MESSAGE
    if (table.WARNING) expectedText += table.WARNING
    expect(standardizePath(this.process.fullOutput())).to.include(expectedText)
  }

  this.verifyPrintedUsageInstructions = () => {
    expect(this.process.fullOutput()).to.include('COMMANDS')
  }

  this.verifyPrints = expectedText => {
    const output = this.process.fullOutput().trim()
    if (!new RegExp(expectedText.trim()).test(output)) {
      throw new Error(
        `expected to find regex '${expectedText.trim()}' in '${output}'`
      )
    }
  }

  this.verifyPrintsNot = text => {
    const output = this.process.fullOutput()
    if (new RegExp(text).test(output)) {
      throw new Error(`expected to not find regex '${text}' in '${output}'`)
    }
  }

  this.verifyRanConsoleCommand = command => {
    expect(this.process.fullOutput()).to.include(
      `running console command: ${command}`
    )
  }

  this.verifyRanOnlyTests = filenames => {
    filenames = flatten(filenames)
    const standardizedOutput = this.output.replace(/\\/g, '/')

    // verify the given tests have run
    for (let filename of filenames) {
      expect(standardizedOutput).to.include(filename)
    }

    // verify all other tests have not run
    const filesShouldntRun = glob
      .sync(`${this.rootDir}/**`)
      .filter(file => fs.statSync(file).isFile())
      .map(file => path.relative(this.rootDir, file))
      .filter(file => file)
      .map(file => file.replace(/\\/g, '/'))
      .filter(file => filenames.indexOf(file) === -1)
    for (let fileShouldntRun of filesShouldntRun) {
      expect(standardizedOutput).to.not.include(fileShouldntRun)
    }
  }

  this.verifyTestsRun = count => {
    expect(this.process.fullOutput()).to.include(` ${count} activities`)
  }

  this.verifyUnknownCommand = command => {
    expect(this.process.fullOutput()).to.include(`unknown command: ${command}`)
  }
}

setWorldConstructor(World)

function standardizePath (path) {
  return path.replace(/\\/g, '/')
}

// Returns the command that runs the given command with test coverage
function runWithTestCoverage (command) {
  return path.join(process.cwd(), 'node_modules', '.bin', 'nyc') + ' ' + command
}

// store the test coverage data before running the next test that would overwrite it
function storeTestCoverage () {
  const outputPath = path.join(process.cwd(), '.nyc_output')
  if (fs.existsSync(outputPath)) {
    fs.moveSync(outputPath, path.join(process.cwd(), '.nyc_output_cli', uuid()))
  }
}