// @flow

const parseMarkdown = require('./parse-markdown.js')
const { expect } = require('chai')
const fs = require('fs')
const path = require('path')

describe('parseMarkdown', function () {
  const testCases = fs.readdirSync(path.join(__dirname, 'tests'))
  for (let testCase of testCases) {
    const testCaseDir = path.join(__dirname, 'tests', testCase)
    const inputs = fs
      .readdirSync(testCaseDir)
      .filter(file => file.endsWith('.md'))
    for (let inputFile of inputs) {
      var name = ''
      if (inputFile !== 'input.md') {
        name = `: ${path.basename(inputFile, '.md')}`
      }
      it(`${testCase}${name}`, function () {
        const input = fs.readFileSync(path.join(testCaseDir, inputFile))
        const result = require(path.join(testCaseDir, 'result.json'))
        expect(parseMarkdown(input.toString().trim(), 'input.md')).to.eql(
          result
        )
      })
    }
  }
})