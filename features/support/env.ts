import { After, Before, setDefaultTimeout } from 'cucumber'
import endChildProcesses from 'end-child-processes'
import fs from 'fs-extra'
import path from 'path'
import rimraf from 'rimraf'
import util from 'util'

// need such a high timeout because test coverage takes time to start up
setDefaultTimeout(30000)

Before(async function() {
  this.rootDir = path.join(process.cwd(), 'tmp')
  let rootDirExists = false
  try {
    await fs.stat(this.rootDir)
    rootDirExists = true
  } catch (e) {
    // nothing to do here
  }
  if (rootDirExists) {
    rimraf.sync(this.rootDir)
  }
  await fs.mkdir(this.rootDir)
})

After(async function(scenario) {
  await util.promisify(endChildProcesses)
  if (scenario.result.status === 'failed') {
    console.log('\ntest artifacts are located in', this.rootDir)
  } else {
    const rimrafp = util.promisify(rimraf)
    await rimrafp(this.rootDir, { maxBusyTries: 20 })
  }
})

Before({ tags: '@verbose' }, function() {
  this.verbose = true
})

After({ tags: '@verbose' }, function() {
  this.verbose = false
})

Before({ tags: '@debug' }, function() {
  this.debug = true
  this.verbose = true
})

After({ tags: '@debug' }, function() {
  this.debug = false
  this.verbose = false
})
