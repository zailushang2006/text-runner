// @flow

const parseMarkdown = require('./parse-markdown.js')
const { expect } = require('chai')
const fs = require('fs')
const path = require('path')

describe('parseMarkdown', function () {
  const testCases = fs.readdirSync(path.join(__dirname, 'tests'))
  for (let testCase of testCases) {
    it(testCase, function () {
      const input = fs.readFileSync(
        path.join(__dirname, 'tests', testCase, 'input.md')
      )
      const result = require(path.join(
        __dirname,
        'tests',
        testCase,
        'result.json'
      ))
      expect(parseMarkdown(input.toString().trim(), 'input.md')).to.eql(result)
    })
  }
})
