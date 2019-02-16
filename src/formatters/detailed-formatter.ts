import chalk from 'chalk'
import path from 'path'
import printCodeFrame from '../helpers/print-code-frame'
import Formatter from './formatter'

export default class DetailedFormatter extends Formatter {
  // A detailed formatter, prints output before the step name

  public error (errorMessage: string) {
    super.error(errorMessage)
    console.log(chalk.dim(this.output))
    process.stdout.write(
      chalk.red(
        `${this.activity.file.platformified()}:${this.activity.line} -- `
      )
    )
    console.log(errorMessage)
    const filePath = path.join(
      this.sourceDir,
      this.activity.file.platformified()
    )
    printCodeFrame(console.log, filePath, this.activity.line)
  }

  public skip (message: string) {
    super.skip(message)
    if (this.output) {
      console.log(chalk.dim(this.output))
    }
    console.log(
      chalk.cyan(
        `${this.activity.file.platformified()}:${
          this.activity.line
        } -- ${message}`
      )
    )
  }

  public success () {
    super.success()
    if (this.output) {
      console.log(chalk.dim(this.output))
    }
    console.log(
      chalk.green(
        `${this.activity.file.platformified()}:${this.activity.line} -- ${
          this.title
        }`
      )
    )
  }

  public warning (warningMessage: string) {
    super.warning(warningMessage)
    if (this.output.trim() !== '') {
      console.log(chalk.dim(this.output))
    }
    console.log(
      chalk.magenta(
        `${this.activity.file.platformified()}:${
          this.activity.line
        } -- ${warningMessage}`
      )
    )
  }
}
