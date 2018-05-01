// @flow

import type { AstNodeList } from '../ast-node-list.js'

const AstStandardizer = require('./ast-standardizer.js')
// $FlowFixMe
const Remarkable = require('remarkable')

const markdownParser = new Remarkable('full', { html: true })

// Parses Markdown files into an AstNode[]
function parseMarkdown (markdownText: string, filepath: string): AstNodeList {
  const raw = markdownParser.parse(markdownText, {})
  const astStandardizer = new AstStandardizer(filepath)
  return astStandardizer.standardize(raw)
}

module.exports = parseMarkdown