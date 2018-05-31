Feature: creating directories

  As a documentation writer
  I want to be able to create directories in the test workspace
  So that my test suite has the folder structure to work.

  - to create a directory, write the directory name as a code tag
    and wrap it in a tag with class textrun="create-directory"


  Scenario: creating a directory
    Given my source code contains the file "creator.md" with content:
      """
      <a textrun="create-directory">
      `directory_name`
      </a>
      """
    When running "text-run --keep-tmp"
    Then it signals:
      | FILENAME | creator.md                      |
      | LINE     | 1                               |
      | MESSAGE  | create directory directory_name |
    And the test workspace now contains a directory "directory_name"


  Scenario: no name given
    Given my source code contains the file "creator.md" with content:
      """
      <a textrun="create-directory">
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | creator.md                              |
      | LINE          | 1                                       |
      | ERROR MESSAGE | Found no nodes of type 'code/code_open' |
      | EXIT CODE     | 1                                       |


  Scenario: empty name given
    Given my source code contains the file "creator.md" with content:
      """
      <a textrun="create-directory">
      ` `
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | creator.md                 |
      | LINE          | 1                          |
      | ERROR MESSAGE | empty directory name given |
      | EXIT CODE     | 1                          |


  Scenario: two names given
    Given my source code contains the file "creator.md" with content:
      """
      <a textrun="create-directory">
      `one` and `two`
      </a>
      """
    When trying to run text-run
    Then the test fails with:
      | FILENAME      | creator.md                             |
      | LINE          | 1                                      |
      | ERROR MESSAGE | Found 2 nodes of type 'code/code_open' |
      | EXIT CODE     | 1                                      |
