import UserError from './user-error'

// Represents a UserError that has not been printed via the formatter.
// This happens for user errors before the formatter could be instantiated
export default class UnprintedUserError extends UserError {
  public filePath: string | undefined
  public line: number | undefined

  constructor (message: string, filePath?: string, line?: number) {
    super(message)
    this.filePath = filePath
    this.line = line
  }
}
