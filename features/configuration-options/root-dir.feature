@debug
Feature: setting the root directory of the documentation base to test

  When running Text-Runner inside a bot
  I want to be able to run it against a documentation base different from the current working directory
  So that my bot can test more than one documentation base at a time.

  - the configuration option "rootDir" allows to provide a different absolute root directory

  Background:
    Given my workspace contains the file "testdir/tr.md" with content:
      """
      <a textrun="run-javascript">
        ```
        console.log('running')
        ```
      </a>
      """
    And I am in the "workdir" folder

  Scenario: run via CLI
    When running "text-run --root-dir ../workdir"

  Scenario: run via API
    When running text-run with the arguments { "rootDir": "../workdir" }
