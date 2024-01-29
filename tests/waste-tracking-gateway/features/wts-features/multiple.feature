@GLW_MULTIPLES
Feature: GLW Multiples

  Scenario: Happy path checking multi CSV with single row with correct data(CSV need to be update)
    Given I upload a CSV with single row with actual data
    Then I should see export is created successfully

    Scenario: Multi CSV with wrong data
      Given I upload a CSV with wrong data
      Then I should see upload should fail with correct error message


