// @flow

const AstNode = require('./ast-node.js')
const AstNodeList = require('./ast-node-list.js')
const { expect } = require('chai')

describe('AstNodeList', function () {
  describe('concat', function () {
    it('adds the nodes in the given list', function () {
      const list1 = new AstNodeList()
      list1.scaffold({ type: 'node1' })
      const list2 = new AstNodeList()
      list1.scaffold({ type: 'node2' })
      list1.concat(list2)
      expect(list1.nodes).to.have.length(2)
      expect(list1.nodes[0].type).to.equal('node1')
      expect(list1.nodes[1].type).to.equal('node2')
    })
  })

  describe('getNodesFor', function () {
    it('returns the nodes until the given node is closed', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'paragraph_open' })
      list.scaffold({ type: 'heading_open' })
      list.scaffold({ type: 'text' })
      list.scaffold({ type: 'heading_close' })
      list.scaffold({ type: 'paragraph_close' })
      const result = list.getNodesFor(list.nodes[1])
      const types = result.nodes.map(node => node.type)
      expect(types).to.eql(['heading_open', 'text', 'heading_close'])
    })
  })

  describe('getTextFor', function () {
    it('returns the textual content until the given node is closed', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'paragraph_open' })
      list.scaffold({ type: 'heading_open' })
      list.scaffold({ type: 'text', content: 'foo' })
      list.scaffold({ type: 'text', content: 'bar' })
      list.scaffold({ type: 'heading_close' })
      list.scaffold({ type: 'paragraph_close' })
      const result = list.getTextFor(list.nodes[1])
      expect(result).to.equal('foobar')
    })
  })

  describe('iterator', function () {
    it('iterates the nodes', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'node1' })
      list.scaffold({ type: 'node2' })
      const result = new AstNodeList()
      for (const node of list) {
        result.push(node)
      }
      expect(result.nodes).to.have.length(2)
      expect(result.nodes[0].type).to.equal('node1')
      expect(result.nodes[1].type).to.equal('node2')
    })
  })

  describe('push', function () {
    it('adds the given node to the internal list', function () {
      const list = new AstNodeList()
      const node = AstNode.scaffold()
      list.push(node)
      expect(list.nodes).to.have.length(1)
      expect(list.nodes[0]).to.equal(node)
    })
  })

  describe('scaffold', function () {
    it('adds a new node with the given attributes', function () {
      const list = new AstNodeList()
      list.scaffold({ type: 'heading_open' })
      list.scaffold({ type: 'text' })
      expect(list.nodes).to.have.length(2)
      expect(list.nodes[0].type).to.eql('heading_open')
      expect(list.nodes[1].type).to.eql('text')
    })
  })
})
