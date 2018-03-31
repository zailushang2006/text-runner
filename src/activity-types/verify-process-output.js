// @flow

import type { Activity } from '../commands/run/activity.js'

const UnprintedUserError = require('../errors/unprinted-user-error')

// Waits until the currently running console command produces the given output
module.exports = async function (activity: Activity) {
  activity.formatter.setTitle(
    'verifying the output of the long-running process'
  )
  const expectedOutput = activity.searcher.tagContent('fence')
  const expectedLines = expectedOutput
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)
  for (let line of expectedLines) {
    activity.formatter.output(`waiting for ${line}`)
    console.log(1111111111111)
    console.log(global.runningProcess)
    if (global.runningProcess.ended) {
      throw new UnprintedUserError('the long-running process has ended')
    }
    await global.runningProcess.waitForText(line)
  }
}
