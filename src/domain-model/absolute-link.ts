import path from 'path'
import Publications from '../configuration/publications'
import addLeadingDotUnlessEmpty from '../helpers/add-leading-dot-unless-empty'
import addLeadingSlash from '../helpers/add-leading-slash'
import removeDoubleSlash from '../helpers/remove-double-slash'
import straightenLink from '../helpers/straighten-link'
import unixify from '../helpers/unifixy'
import AbsoluteFilePath from './absolute-file-path'
import RelativeLink from './relative-link'

// Represents a link to another Markdown file,
// all the way from the root directory
// (i.e. a link starting with '/')
export default class AbsoluteLink {
  public value: string

  constructor (publicPath: string) {
    this.value = addLeadingSlash(removeDoubleSlash(unixify(publicPath)))
  }

  // Returns the anchor part of this link
  public anchor (): string {
    return this.value.split('#')[1] || ''
  }

  // Returns a new link that consists of this link
  // with the given relative link appended
  public append (segment: RelativeLink): AbsoluteLink {
    return new AbsoluteLink(straightenLink(this.value + '/' + segment.value))
  }

  // Returns a link to the containing directory
  public directory (): AbsoluteLink {
    const withoutAnchor = this.withoutAnchor()
    if (withoutAnchor.isLinkToDirectory()) {
      return withoutAnchor
    }
    return new AbsoluteLink(
      withoutAnchor.value.substr(0, withoutAnchor.value.lastIndexOf('/') + 1)
    )
  }

  public hasAnchor (): boolean {
    return this.anchor() !== ''
  }

  // Returns whether this link has the given extension
  public hasExtension (extension: string): boolean {
    return path.extname(this.value) === addLeadingDotUnlessEmpty(extension)
  }

  // Returns whether this link points to a directory
  public isLinkToDirectory (): boolean {
    return this.value.endsWith('/')
  }

  // Returns the file path that this link has on the local filesystem
  public localize (
    publications: Publications,
    defaultFile: string
  ): AbsoluteFilePath {
    const publication = publications.publicationForLink(this)
    let result = publication
      ? publication.resolve(this.urlDecoded(), defaultFile)
      : new AbsoluteFilePath(this.urlDecoded().withoutAnchor().value)

    // append the default file
    if (result.extName() === '' && defaultFile) {
      result = result.append(defaultFile)
    }
    return result
  }

  // Returns a link where the old enclosing directory is replaced
  // with the new enclosing directory
  public rebase (oldPath: string, newPath: string): AbsoluteLink {
    const re = new RegExp('^' + oldPath)
    return new AbsoluteLink(this.value.replace(re, newPath))
  }

  public urlDecoded (): AbsoluteLink {
    return new AbsoluteLink(decodeURI(this.value))
  }

  // Returns a link that contains the given anchor
  public withAnchor (anchor: string): AbsoluteLink {
    return new AbsoluteLink(this.withoutAnchor().value + '#' + anchor)
  }

  // Returns another AbsoluteLink instance that uses the given file extension
  public withExtension (newExtension: string): AbsoluteLink {
    const extRE = new RegExp(path.extname(this.value) + '$')
    return new AbsoluteLink(
      this.value.replace(extRE, addLeadingDotUnlessEmpty(newExtension))
    )
  }

  // Returns a link that is this link without the anchor
  public withoutAnchor (): AbsoluteLink {
    return new AbsoluteLink(this.value.split('#')[0])
  }
}
