@debug
Feature: setting the root directory of the documentation base to test

    When running Text-Runner inside a bot
  I want to be able to run it against a documentation base different from the current working directory
  So that my bot can test more than one documentation base at a time.

  - the configuration option "rootDir" allows to provide a different absolute root directory

  Background:
    Given I am in a directory that contains the "print-config" example

  Scenario: default behavior
    When running text-run
    Then it prints the current working directory as the root dir

  Scenario: custom rootDir Given
    When running text-run with the argument { "rootDir": "c:\\" }
    Then it prints "c:\\" as the current working directory
