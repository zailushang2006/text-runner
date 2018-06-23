// // @flow
//
// import type { AstNode } from '../2-read-and-parse/ast-node.js'
// import type { AstNodeList } from '../2-read-and-parse/ast-node-list.js'
//
// const UnprintedUserError = require('../../../errors/unprinted-user-error.js')
//
// type NodeQuery = string | string[]
//
// class Searcher {
//   // the AstNodes that belong to the active block that this Searcher is for
//   nodes: AstNodeList
//
//   // the currently executed query
//   query: NodeQuery
//
//   constructor (nodes: AstNodeList) {
//     this.nodes = nodes
//   }
//
//   // Returns the textual content of the node matching the given query
//   tagContent (query: NodeQuery, options?: { default?: string }): string {
//     if (options == null) options = {}
//     const matchingNode = this.findNode(query, options)
//     if (matchingNode == null) {
//       if (options.default != null) {
//         return options.default
//       } else {
//         throw new UnprintedUserError(`no ${this._queryName()} found`)
//       }
//     }
//     var result = matchingNode.content || options.default || ''
//     result = result.trim()
//     if (result.length === 0 && options.default != null) {
//       throw new Error(`empty ${this._queryName()} found`)
//     }
//     return result
//   }
//
//   // Returns the textual content of the nodes matching the given query
//   tagsContents (query: NodeQuery): string[] {
//     const matchingNodes = this.findNodes(query)
//     return matchingNodes.map(node => (node.content || '').trim())
//   }
//
//   // findNode returns the AstNode matching the given query
//   findNode (query: NodeQuery, options: { default?: string }): ?AstNode {
//     if (options == null) options = {}
//     this.query = query
//     const result = this.nodes.filter(this._getMatcher())
//     if (result.length > 1) {
//       throw new Error(
//         `found more than one ${this._queryName()} tag in the active block`
//       )
//     }
//     if (result.length === 0) {
//       if (options.default != null) {
//         return null
//       } else {
//         throw new Error(
//           `no ${this._queryName()} tag found in this active block`
//         )
//       }
//     }
//     return result[0]
//   }
//
//   // findNode returns the AstNode matching the given query
//   findNodes (query: NodeQuery): AstNode[] {
//     this.query = query
//     return this.nodes.filter(this._getMatcher())
//   }
//
//   // _arrayMatcher is the matcher function for Array-type queries
//   _arrayMatcher (node: AstNode): boolean {
//     return node.type != null && this.query.includes(node.type)
//   }
//
//   // _getMatcher returns a function that returns
//   // whether a given node matches the current query
//   _getMatcher (): AstNode => boolean {
//     if (typeof this.query === 'string') {
//       return this._stringMatcher.bind(this)
//     } else {
//       return this._arrayMatcher.bind(this)
//     }
//   }
//
//   // _stringMatcher is the matcher function for string-type queries
//   _stringMatcher (node: AstNode): boolean {
//     return node.type === this.query
//   }
//
//   // _queryName returns a textual representation of the current query
//   _queryName (): string {
//     if (typeof this.query === 'string') {
//       return quoteString(this.query)
//     } else {
//       return this.query.map(quoteString).join(' or ')
//     }
//   }
// }
//
// function quoteString (text: string): string {
//   return `'${text}'`
// }
//
// module.exports = Searcher
