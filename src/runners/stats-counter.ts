import Time from 'time-diff'

export default class StatsCounter {
  public errorCount: number
  public skipCount: number
  public successCount: number
  public warningCount: number
  public time: Time

  constructor () {
    this.errorCount = 0
    this.skipCount = 0
    this.successCount = 0
    this.warningCount = 0
    this.time = new Time()
    this.time.start('formatter')
  }

  public duration () {
    return this.time.end('formatter')
  }

  public error () {
    this.errorCount += 1
  }

  public errors (): number {
    return this.errorCount
  }

  public skip () {
    this.skipCount += 1
  }

  public skips (): number {
    return this.skipCount
  }

  public success () {
    this.successCount += 1
  }

  public successes (): number {
    return this.successCount
  }

  public warning () {
    this.warningCount += 1
  }

  public warnings (): number {
    return this.warningCount
  }
}
