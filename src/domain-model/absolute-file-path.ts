// NOTE: have to load the exports at the bottom of the file
//       to avoid a circular dependency issue here

// AbsoluteFilePath represents a complete path from the root directory
// to a markdown file on the local file system.
import path from 'path'
import Publications from '../configuration/publications'
import removeLeadingSlash from '../helpers/remove-leading-slash'
import unixify from '../helpers/unifixy'
import AbsoluteLink from './absolute-link'

export default class AbsoluteFilePath {
  public value: string

  constructor (value: string) {
    this.value = removeLeadingSlash(unixify(value))
  }

  // Returns a new file path
  // with the given file name appended to the end of this file path
  public append (fileName: string): AbsoluteFilePath {
    return new AbsoluteFilePath(path.join(this.platformified(), fileName))
  }

  // Returns the directory that contains this file path
  public directory (): AbsoluteFilePath {
    if (this.isDirectory()) {
      return this
    }
    return new AbsoluteFilePath(path.dirname(this.value) + '/')
  }

  // Returns the file extension of this path
  public extName (): string {
    return path.extname(this.value)
  }

  // Returns whether this file path points to a directory
  public isDirectory (): boolean {
    return this.value.endsWith('/')
  }

  // Returns the path in the platform-specific format,
  // i.e. using '\' on Windows and '/' everywhere else
  public platformified (): string {
    return this.value.replace(/\//g, path.sep)
  }

  // Returns this absolute path using forward slashes as path separators
  public unixified (): string {
    return this.value
  }

  // Returns the public link under which this file path is published
  public publicPath (publications: Publications): AbsoluteLink {
    const publication = publications.forFilePath(this)
    if (publication == null) {
      return new AbsoluteLink(this.unixified())
    }
    return publication.publish(this)
  }
}
