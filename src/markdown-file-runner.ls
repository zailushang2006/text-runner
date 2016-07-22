require! {
  'async'
  'chalk' : {bold, cyan, red}
  'fs'
  'path'
  'prelude-ls' : {capitalize}
  'remarkable' : Remarkable
  './runners/console-command-runner' : ConsoleCommandRunner
  './runners/create-file-runner' : CreateFileRunner
  './runners/verify-file-content-runner' : VerifyFileContentRunner
}
debug = require('debug')('markdown-file-runner')


# Runs the given Markdown file
class MarkdownFileRunner

  (@file-path, @formatter) ->

    @markdown-parser = new Remarkable 'full', html: on

    # the current block runner instance
    @current-runner = null

    @current-line = 0

    # all runners
    @runners = []


  run: (done) ->
    @formatter.start-documentation-file path.relative(process.cwd!, @file-path)
    markdown-text = fs.read-file-sync(@file-path, 'utf8').trim!
    if markdown-text.length is 0
      @formatter.error "found empty file #{cyan(path.relative process.cwd!, @file-path)}"
    markdown-ast = @markdown-parser.parse markdown-text, {}
    @_check-nodes markdown-ast
    async.map-series @runners,
                      ((runner, cb) -> runner.run cb),
                      done


  _check-nodes: (tree) ->
    for node in tree
      @current-line = node.lines[0] + 1 if node.lines
      if node.type is 'htmltag'

        if matches = node.content.match /<a class="tutorialRunner_([^"]+)">/
          throw new Error 'Found a nested <a class="tutorialRunner_*"> block' if @current-runner
          class-name = "#{capitalize matches[1]}Runner"
          debug "instantiating '#{class-name}'"
          clazz = eval class-name
          @current-runner = new clazz @current-line, @formatter

        if node.content is '</a>'
          @runners.push @current-runner if @current-runner
          @current-runner = null

      @current-runner?.load node
      @_check-nodes node.children if node.children


module.exports = MarkdownFileRunner
