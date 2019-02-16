import AbsoluteFilePath from '../../../../domain-model/absolute-file-path'
import pretendToUse from '../../../../helpers/pretend-to-use'
import AstNode from '../../../ast-node'
import AstNodeList from '../../../ast-node-list'
import OpenTagTracker from '../../helpers/open-tag-tracker'

export default function transformATag (
  node: any,
  openTags: OpenTagTracker,
  file: AbsoluteFilePath,
  line: number
): AstNodeList {
  const result = new AstNodeList()
  const openingTag = openTags.popType('abbr_open', file, line)
  const resultNode = new AstNode({
    attributes: openingTag.attributes,
    content: '',
    file,
    line,
    tag: '/abbr',
    type: 'abbr_close'
  })
  result.pushNode(resultNode)
  pretendToUse(node)
  return result
}
