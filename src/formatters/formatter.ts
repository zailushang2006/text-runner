import { WriteStream } from 'observable-process'
import { Activity } from '../activity-list/activity'

import deb from 'debug'
import humanize from 'humanize-string'
import StatsCounter from '../runners/stats-counter'

const debug = deb('formatter')

interface Console {
  log(text: string): void
}

// Base class for formatters
export default class Formatter {
  public activity: Activity
  public console: Console
  public sourceDir: string
  public statsCounter: StatsCounter
  public stderr: WriteStream
  public stdout: WriteStream
  public output: string
  public title: string
  public skipped: boolean
  // TODO: remove this?
  public warned: boolean

  constructor (
    activity: Activity,
    sourceDir: string,
    statsCounter: StatsCounter
  ) {
    this.activity = activity
    this.statsCounter = statsCounter
    this.stdout = { write: this.log.bind(this) }
    this.stderr = { write: this.log.bind(this) }
    this.output = ''
    this.title = humanize(activity.type)
    this.sourceDir = sourceDir
    this.skipped = false
    this.warned = false
    this.console = {
      log: text => this.stdout.write(text + '\n')
    }
  }

  public error (errorMessage: string) {
    debug('error: ' + errorMessage)
    this.statsCounter.error()
  }

  public log (text: string | Buffer): boolean {
    this.output += text.toString()
    return false
  }

  public skip (message: string) {
    debug('skipping: ' + message)
    this.skipped = true
    this.statsCounter.skip()
  }

  public success () {
    this.statsCounter.success()
  }

  // allows the user to set a new name for this step
  public name (newTitle: string) {
    this.title = newTitle
  }

  public warning (warningMessage: string) {
    debug('warning: ' + warningMessage)
    this.warned = true
    this.statsCounter.warning()
  }
}
