Feature: verifying file content

  As a tutorial writer
  I want to be able to write actions that verify created files
  So that I am sure my tools performs the correct actions on the hard drive.


  Background:
    Given I am in a directory containing a file "file-content-verifier.md" with the content:
      """
      Our workspace contains the file:

      <a class="tutorialRunner_verifyFileContent">
      __one.txt__

      ```
      Hello world!
      ```

      </a>
      """


  Scenario: file content matches
    Given the file "one.txt" with the content:
      """
      Hello world!
      """
    When running "tut-run"
    Then it prints:
      """
      file-content-verifier.md:3 -- verifying file one.txt
      """
    And the test passes
    And the directory still contains a file "one.txt" with content:
      """
      Hello world!
      """



  Scenario: file content mismatch
    Given the file "one.txt" with the content:
      """
      Unexpected content here
      """
    When running "tut-run"
    Then the test fails with exit code 1 and the error:
      """
      file-content-verifier.md:3 -- Error: mismatching content in one.txt:
      mismatching records:

      Hello world!Unexpected content here
      """
    And the directory still contains a file "one.txt" with content:
      """
      Unexpected content here
      """


  Scenario: file is missing
    When running "tut-run"
    Then the test fails with exit code 1 and the error:
      """
      file-content-verifier.md:3 -- Error: file one.txt not found
      """
