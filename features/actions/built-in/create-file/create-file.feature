Feature: creating files with content

  As a documentation writer
  I want to be able to create files with content
  So that my test suite has files to work with.

  - to create a file, wrap the code in a tag with class textrun="create-file"
  - the file name is provided as emphasized or bold text
  - content is provided as a triple-fenced code block


  Scenario: providing the filename as emphasized text and the content single-quoted
    Given my source code contains the file "creator.md" with content:
      """
      <a textrun="create-file">
      creating a file with name _one.txt_ and content `Hello world!`
      </a>
      """
    When running "text-run --keep-tmp"
    Then it signals:
      | FILENAME | creator.md          |
      | LINE     | 1                   |
      | MESSAGE  | create file one.txt |
    And the test directory now contains a file "one.txt" with content:
      """
      Hello world!
      """


  Scenario: providing the filename as bold text and the content triple-quoted
    Given my source code contains the file "creator.md" with content:
      """
      <a textrun="create-file">
      creating a file with name __one.txt__ and content:

      ```
      Hello world!
      ```
      </a>
      """
    When running "text-run --keep-tmp"
    Then it signals:
      | FILENAME | creator.md          |
      | LINE     | 1                   |
      | MESSAGE  | create file one.txt |
    And the test directory now contains a file "one.txt" with content:
      """
      Hello world!
      """


  Scenario: no file path given
    Given my source code contains the file "creator.md" with content:
      """
      <a textrun="create-file">
      ```
      Hello world!
      ```
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | creator.md                                             |
      | LINE          | 1                                                      |
      | ERROR MESSAGE | Found no nodes of type 'em/strong/em_open/strong_open' |
      | EXIT CODE     | 1                                                      |


  Scenario: no content block given
    Given my source code contains the file "creator.md" with content:
      """
      <a textrun="create-file">
      __one.txt__
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | creator.md                                               |
      | LINE          | 1                                                        |
      | ERROR MESSAGE | Found no nodes of type 'fence/code/fence_open/code_open' |
      | EXIT CODE     | 1                                                        |


  Scenario: two file paths given
    Given my source code contains the file "creator.md" with content:
      """
      <a textrun="create-file">
      __one.txt__
      __two.txt__

      ```
      Hello world!
      ```
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | creator.md                                            |
      | LINE          | 1                                                     |
      | ERROR MESSAGE | Found 2 nodes of type 'em/strong/em_open/strong_open' |
      | EXIT CODE     | 1                                                     |


  Scenario: two content blocks given
    Given my source code contains the file "creator.md" with content:
      """
      <a textrun="create-file">
      __one.txt__

      ```
      Hello world!
      ```

      ```
      Another world!
      ```

      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | creator.md                                             |
      | LINE          | 1                                                      |
      | ERROR MESSAGE | Found 2 nodes of type 'fence/code/fence_open/code_open |
      | EXIT CODE     | 1                                                      |
