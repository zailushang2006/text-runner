@verbose
Feature: running inline blocks of Javascript

  As a tutorial writer describing a Javascript tool
  I want to be able to run pieces of inline Javascript code
  So that my tutorial can explain how to use that tool.

  - fenced code blocks wrapped in a "runJavascript" block are executed
  - local variable declarations persist across different code block calls


  Scenario: running synchronous Javascript
    Given my workspace contains the file "1.md" with the content:
      """
      <a class="tutorialRunner_runJavascript">
      ```
      const foo = 'bar'
      console.log('A foo walks into a ' + foo)
      ```
      </a>
      """
    When running tut-run
    Then it prints:
      """
      A foo walks into a bar
      """


  Scenario: running asynchronous Javascript using the "// ..." keyword
    Given my workspace contains the file "1.md" with the content:
      """
      <a class="tutorialRunner_runJavascript">
      ```
      const wait = require('wait')
      const foo = 'bar'
      wait(1, function() {
        console.log('A foo walks into a ' + foo)
        // ...
      })
      ```
      </a>
      """
    When running tut-run
    Then it prints:
      """
      A foo walks into a bar
      """


  Scenario: running asynchronous Javascript using the "<CALLBACK>" keyword
    Given my workspace contains the file "1.md" with the content:
      """
      <a class="tutorialRunner_runJavascript">
      ```
      const wait = require('wait')
      const foo = 'bar'
      wait(1, <CALLBACK>)
      ```
      </a>
      """
    When running tut-run
    Then the test passes


  Scenario: persisting variables across blocks
    Given my workspace contains the file "1.md" with the content:
      """
      <a class="tutorialRunner_runJavascript">
      ```
      const name = "Jean-Luc Picard"
      ```
      </a>

      <a class="tutorialRunner_runJavascript">
      ```
      console.log("my name is " + name)
      ```
      </a>
      """
    When running tut-run
    Then it prints:
      """
      my name is Jean-Luc Picard
      """


  Scenario: missing code block
    Given my workspace contains the file "1.md" with the content:
      """
      <a class="tutorialRunner_runJavascript">
      </a>
      """
    When trying to run tut-run
    Then it signals:
      | FILENAME      | 1.md                    |
      | LINE          | 1                       |
      | MESSAGE       | running JavaScript code |
      | ERROR MESSAGE | no code to run found    |
      | EXIT CODE     | 1                       |


  Scenario: multiple code blocks
    Given my workspace contains the file "1.md" with the content:
      """
      <a class="tutorialRunner_runJavascript">
      ```
      console.log(name)
      ```
      ```
      console.log(name)
      ```
      </a>
      """
    When trying to run tut-run
    Then it signals:
      | FILENAME      | 1.md                       |
      | LINE          | 1-8                        |
      | MESSAGE       | running JavaScript code    |
      | ERROR MESSAGE | too many code blocks found |
      | EXIT CODE     | 1                          |