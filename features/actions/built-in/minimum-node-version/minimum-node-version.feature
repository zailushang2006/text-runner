Feature: minimum NodeJS version

  As a developer building an NPM module
  I want to be sure that the Node version that my documentation says is supported is actually supported
  So that my documentation gets updated when I change which Node versions I support.

  - to check the required Node version, wrap the minimum required Node version
    in an A tag with class "tutorialRunner_minimumNodeVersion"
  - the action checks the Travis configuration file


  Background:
    Given my workspace contains the file ".travis.yml" with the content:
      """
      node_js:
        - '4'
        - '6'
        - '7'
      """


  Scenario: matching minimum Node version
    Given my workspace contains the file "README.md" with the content:
      """
      Requires Node version <a class="tutorialRunner_minimumNodeVersion">4</a> or above
      """
    When running tut-run
    Then it signals:
      | FILENAME | README.md                |
      | LINE     | 1                        |
      | MESSAGE  | requires at least Node 4 |


  Scenario: documented minimum Node version is too low
    Given my workspace contains the file "README.md" with the content:
      """
      Requires Node version <a class="tutorialRunner_minimumNodeVersion">3</a> or above
      """
    When running tut-run
    Then the test fails with:
      | FILENAME      | README.md                                                 |
      | LINE          | 1                                                         |
      | MESSAGE       | determining whether minimum supported NodeJS version is 3 |
      | ERROR MESSAGE | documented minimum Node version is 3, should be 4         |
      | EXIT CODE     | 1                                                         |


  Scenario: documented minimum Node version is too high
    Given my workspace contains the file "README.md" with the content:
      """
      Requires Node version <a class="tutorialRunner_minimumNodeVersion">5</a> or above
      """
    When running tut-run
    Then the test fails with:
      | FILENAME      | README.md                                                 |
      | LINE          | 1                                                         |
      | MESSAGE       | determining whether minimum supported NodeJS version is 5 |
      | ERROR MESSAGE | documented minimum Node version is 5, should be 4         |
      | EXIT CODE     | 1                                                         |
