import AbsoluteFilePath from '../domain-model/absolute-file-path'

// A node in the standardized Markdown/HTML AST
export default class AstNode {
  public static scaffold (data: any = {}): AstNode {
    if (typeof data.file === 'string') {
      data.file = new AbsoluteFilePath(data.file)
    }
    return new AstNode({
      attributes: data.attributes || {},
      content: data.content || '',
      file: data.file || new AbsoluteFilePath('file'),
      line: data.line || 1,
      tag: data.tag != null ? data.tag : 'tag',
      type: data.type || 'type'
    })
  }
  public type: string // markdown type of AST node
  public tag: string // HTML type of AST node
  public file: AbsoluteFilePath // the file in which this AstNode occurs
  public line: number // the line in the file at which this AST node occurs
  public content: string // textual content of this AST node
  public attributes: { [key: string]: string } // the attributes of the node

  constructor (data: {
    type: string
    tag: string
    file: AbsoluteFilePath
    line: number
    content: string
    attributes: { [key: string]: string }
  }) {
    this.type = data.type
    this.tag = data.tag
    this.file = data.file
    this.line = data.line
    this.content = data.content
    this.attributes = data.attributes
  }

  // Returns the type of the corresponding ending node
  public endType (): string {
    if (!this.isOpeningNode()) {
      throw new Error('not an opening node')
    }
    return this.type.replace('open', '') + 'close'
  }

  public htmlLinkTarget (): string | null {
    if (this.content == null) {
      return null
    }
    if (this.type !== 'htmltag') {
      return null
    }
    const matches = this.content.match(/<a[^>]*href="([^"]*)".*?>/)
    return matches ? matches[1] : null
  }

  public isOpeningNode (): boolean {
    return this.type.endsWith('_open')
  }

  public isClosingNode (): boolean {
    return this.type.endsWith('_close')
  }
}
