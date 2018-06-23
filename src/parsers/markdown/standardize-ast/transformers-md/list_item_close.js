// @flow

const AstNodeList = require('../../../ast-node-list.js')
const OpenTagTracker = require('../../helpers/open-tag-tracker.js')

module.exports = function (
  node: Object,
  openTags: OpenTagTracker,
  file: string,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  const openNode = openTags.popType('list_item_open')
  result.pushData({
    type: node.type,
    tag: '/li',
    file,
    line,
    content: '',
    attributes: openNode.attributes
  })
  return result
}
