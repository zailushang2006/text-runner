// @flow

// A node in the standardized Markdown/HTML AST
module.exports = class AstNode {
  type: string // markdown type of AST node
  tag: string // HTML type of AST node
  file: string // the file in which this AstNode occurs
  line: number // the line in the file at which this AST node occurs
  content: string // textual content of this AST node
  attributes: { [string]: string } // the attributes of the node

  constructor (data: {
    type: string,
    tag: string,
    file: string,
    line: number,
    content: string,
    attributes: { [string]: string }
  }) {
    this.type = data.type
    this.tag = data.tag
    this.file = data.file
    this.line = data.line
    this.content = data.content
    this.attributes = data.attributes
  }

  isOpeningNode (): boolean {
    return this.type.endsWith('_open')
  }

  isClosingNode (): boolean {
    return this.type.endsWith('_close')
  }

  static scaffold (data: Object = {}): AstNode {
    return new AstNode({
      type: data.type || 'type',
      tag: data.tag || 'tag',
      file: data.file || 'file',
      line: data.line || 1,
      content: data.content || 'content',
      attributes: data.attributes || {}
    })
  }
}
