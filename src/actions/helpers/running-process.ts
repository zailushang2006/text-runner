import { ObservableProcess } from 'observable-process'

export default class RunningProcess {
  public static instance (): RunningProcess {
    return instance
  }
  public process: ObservableProcess | null

  constructor () {
    this.process = null
  }

  public hasProcess (): boolean {
    return this.process != null
  }
  public kill () {
    this.process && this.process.kill()
  }

  public reset () {
    this.process = null
  }

  public set (process: ObservableProcess) {
    this.process = process
  }
}

const instance = new RunningProcess()
