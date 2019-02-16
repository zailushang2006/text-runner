import { ObservableProcess } from 'observable-process'

// Provides global access to the currently running console command
class RunningConsoleCommand {
  // Returns the currently running console command
  public static instance (): ObservableProcess {
    if (!instance) {
      throw new Error()
    }
    return instance
  }

  public static set (process: ObservableProcess) {
    instance = process
  }
}

let instance: ObservableProcess | null = null

export default RunningConsoleCommand
