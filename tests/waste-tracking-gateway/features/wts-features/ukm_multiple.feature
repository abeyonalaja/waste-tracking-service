@UKM_MULTIPLES @csv
Feature: UKM Multiples

  Scenario: UKM Multiple verifying producer details
    Given I upload a UKM "UKM_Producer_errors" CSV with data
    Then I should see UKM upload should fail with correct error message
    And "UKM_Producer_errors" UKM csv status should be "FailedValidation"
    And UKM csv response message should match the "UKM_Producer_errors"

  Scenario: UKM Multiple verifying collection details
    Given I upload a UKM "UKM_Waste_Collection_errors" CSV with data
    Then I should see UKM upload should fail with correct error message
    And "UKM_Waste_Collection_errors" UKM csv status should be "FailedValidation"
    And UKM csv response message should match the "UKM_Waste_Collection_errors"

  Scenario: UKM Multiple verifying receiver details
    Given I upload a UKM "UKM_Receiver_errors" CSV with data
    Then I should see UKM upload should fail with correct error message
    And "UKM_Receiver_errors" UKM csv status should be "FailedValidation"
    And UKM csv response message should match the "UKM_Receiver_errors"

  Scenario: UKM Multiple verifying Waste Transport details
    Given I upload a UKM "UKM_waste_transport_details_errors" CSV with data
    Then I should see UKM upload should fail with correct error message
    And "UKM_waste_transport_details_errors" UKM csv status should be "FailedValidation"
    And UKM csv response message should match the "UKM_waste_transport_details_errors"
