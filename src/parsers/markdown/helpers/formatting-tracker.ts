import AstNode from '../../ast-node'

// FormattingTracker tracks formatting nodes
// like 'em' and 'strong'
export default class FormattingTracker {
  public tags: string[]

  constructor () {
    this.tags = []
  }

  public register (node: AstNode): boolean {
    let result = true
    if (node.type === 'em_open') {
      this.open('emphasized')
    } else if (node.type === 'em_close') {
      this.close('emphasized')
    } else if (node.type === 'strong_open') {
      this.open('strong')
    } else if (node.type === 'strong_close') {
      this.close('strong')
    } else {
      result = false
    }
    return result
  }

  public open (tagName: string) {
    this.tags.push(tagName)
  }

  public close (tagName: string) {
    this.tags.splice(this.tags.indexOf(tagName), 1)
  }

  public toString (): string {
    return this.tags.sort().join('')
  }
}
