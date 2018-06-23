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
  result.pushData({
    type: 'image',
    tag: 'img',
    file: file,
    line,
    content: '',
    attributes: {
      src: node.src,
      alt: node.alt
    }
  })
  return result
}
