// @flow

const AstNode = require('../../../ast-node.js')
const AstNodeList = require('../../../ast-node-list.js')
const parseHtmlAttributes = require('../../helpers/parse-html-attributes.js')
const OpenTagTracker = require('../../helpers/open-tag-tracker.js')

const blockquoteRegex = /<blockquote([^>]*)>([\s\S]*)<\/blockquote>/m

module.exports = function (
  node: Object,
  openTags: OpenTagTracker,
  file: string,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  const blockquoteMatch = node.content.match(blockquoteRegex)
  const resultNode = new AstNode({
    type: node.type,
    tag: 'blockquote',
    file,
    line,
    content: '',
    attributes: parseHtmlAttributes(blockquoteMatch[1])
  })
  openTags.add(resultNode)
  result.pushData(resultNode)
  return result
}