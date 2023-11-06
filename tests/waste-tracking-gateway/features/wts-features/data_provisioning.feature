Feature: Checking the data provisioning API

  Scenario: Checking the waste code data for en
    Given I request waste code for "en"
    Then I should see all the waste code for "en"

  Scenario: Checking the waste code data for cy
    Given I request waste code for "cy"
    Then I should see all the waste code for "cy"

  Scenario: Checking the EWC code data for en
    Given I request EWC code for "en"
    Then I should see all the EWC code for "en"

  Scenario: Checking the EWC code data for cy
    Given I request EWC code for "cy"
    Then I should see all the EWC code for "cy"


  Scenario: Checking the countries data for en
    Given I request countries for "en"
    Then I should see all the countries for "en"

  Scenario: Checking the countries data for cy
    Given I request countries for "cy"
    Then I should see all the countries for "cy"
