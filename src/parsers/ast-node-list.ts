import UnprintedUserError from '../errors/unprinted-user-error'
import AstNode from './ast-node'

export default class AstNodeList extends Array<AstNode> {
  // Creates a new AstNodeList containing the given data
  static scaffold(data: any = {}): AstNodeList {
    const result = new AstNodeList()
    result.push(AstNode.scaffold(data))
    return result
  }
  // Returns the AstNode matching any of the given types.
  // Only one result is expected,
  // multiple or zero matches cause an exception.
  getNodeOfTypes(...nodeTypes: string[]): AstNode {
    const nodes = this.getNodesOfTypes(...nodeTypes)
    if (nodes.length > 1) {
      throw new UnprintedUserError(
        `Found ${nodes.length} nodes of type '${nodeTypes.join('/')}'`,
        nodes[0].file.platformified(),
        nodes[0].line
      )
    }
    if (nodes.length === 0) {
      let msg = `Found no nodes of type '${nodeTypes.join('/')}'. `
      msg += 'The node types in this list are: '
      msg += this.nodeTypes().join(', ')
      throw new UnprintedUserError(
        msg,
        this[0].file.platformified(),
        this[0].line
      )
    }
    return nodes[0]
  }

  getNodesFor(openingNode: AstNode): AstNodeList {
    if (openingNode == null) {
      throw new UnprintedUserError('null Node given')
    }
    let index = this.indexOf(openingNode)
    if (index === -1) {
      throw new UnprintedUserError(
        `node '${openingNode.type}' not found in list`,
        openingNode.file.platformified(),
        openingNode.line
      )
    }
    const result = new AstNodeList()
    if (!openingNode.isOpeningNode()) {
      result.push(openingNode)
      return result
    }
    const endType = openingNode.endType()
    let node: AstNode
    do {
      node = this[index]
      result.push(node)
      index += 1
    } while (node.type !== endType && index < this.length)
    return result
  }

  getNodesOfTypes(...nodeTypes: string[]): AstNodeList {
    const result = new AstNodeList()
    const matchingNodes = this.filter(node => nodeTypes.includes(node.type))
    for (const node of matchingNodes) {
      result.push(node)
    }
    return result
  }

  hasNodeOfType(nodeType: string): boolean {
    const types = [nodeType]
    types.push(nodeType + '_open')
    return this.some(node => types.includes(node.type))
  }

  // returns all node types encountered in this list
  nodeTypes(): string[] {
    return this.map(node => node.type)
  }

  // Adds a new AstNode with the given data to this list
  pushNode(data: any) {
    this.push(AstNode.scaffold(data))
  }

  text(): string {
    return this.reduce((acc, node) => acc + node.content, '')
  }

  // returns the textual content for the given node
  textInNode(astNode: AstNode): string {
    return this.getNodesFor(astNode).reduce(
      (acc, node) => acc + node.content,
      ''
    )
  }

  // Returns the text in the nodes of the given types.
  // Expects that exactly one matching node exists,
  // throws otherwise.
  textInNodeOfType(...nodeTypes: string[]): string {
    for (const nodeType of nodeTypes) {
      if (!nodeType.endsWith('_open')) {
        nodeTypes.push(nodeType + '_open')
      }
    }
    return this.textInNode(this.getNodeOfTypes(...nodeTypes))
  }

  textInNodesOfType(...nodeTypes: string[]): string[] {
    for (const nodeType of nodeTypes) {
      if (!nodeType.endsWith('_open')) {
        nodeTypes.push(nodeType + '_open')
      }
    }
    return this.getNodesOfTypes(...nodeTypes).map(node => this.textInNode(node))
  }
}
