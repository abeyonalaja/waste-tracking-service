@add_reference_number
Feature: AS A Waste Producer/Broker
  I NEED to enter reference number
  SO THAT track my waste can be processed for export

  Scenario: Check the waste reference number valid
    Given I POST reference number "API Testing" for waste export
    Then reference number should be successfully created

  Scenario: Check the waste reference number empty
    Given I POST reference number "" for waste export
    Then reference number should be successfully created

  Scenario: Check the waste reference number limit more than 50 characters
    Given I POST long reference number "abcdefghijklmnopqrstuvwxy987234987293847923479234983z01234567891234567890dfghujgdfd" for waste export
    Then reference number should not be created


