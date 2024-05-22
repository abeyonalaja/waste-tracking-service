@GLW_MULTIPLES @csv
Feature: GLW Multiples

  Scenario: Happy path checking multi CSV with single row with correct data(CSV need to be update)
    Given I upload a CSV with single row with actual data
    Then I should see export is created successfully

    Scenario: GLW Multiple verifying about waste section columns
      Given I upload a "about_waste_error" CSV with data
      Then I should see upload should fail with correct error message
      And "about_waste_error" csv status should be "FailedValidation"
      And response message should match the "about_waste_error"


