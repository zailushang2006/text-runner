// @flow

const AstNodeList = require('../parsers/ast-node-list.js')

// Activity is an action instance, i.e. a particular activity that we are going to do
// on a particular place in a particular document, defined by an action
export type Activity = {
  type: string,
  file: string,
  line: number,
  nodes: AstNodeList
}
