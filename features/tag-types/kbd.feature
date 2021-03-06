Feature: KBD tags

  When testing Markdown documentation
  I want to be able to use KBD tags
  So that I don't have to litter my document with <a> tags


  Background:
    Given my workspace contains the HelloWorld activity


  Scenario: code tag
    Given my source code contains the file "1.md" with content:
      """
      <kbd textrun="HelloWorld">foo</kbd>
      """
    When running text-run
    Then it signals:
      | FILENAME | 1.md        |
      | LINE     | 1           |
      | MESSAGE  | Hello world |

  Scenario: inactive HR tag
    Given my source code contains the file "1.md" with content:
      """
      <kbd>foo</kbd>
      """
    When running text-run

