@UKMV
Feature: AS A Waste controller
  I NEED to be able to confirm the waste collection address
  SO THAT I can ensure the correct address is being used for the waste collection

  @translation
  Scenario: User navigates to Confirm waste collection address page and verify its correctly translated
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Waste collection details" link
    Then the "Whats Waste Collection Address" page is displayed
    And I enter valid waste collection address postcode
    And I click search postcode button
    Then the "Select Waste Collection Address" page is displayed
    And I select first waste collection address
    And I click the button Save and continue
    Then the "Confirm Waste Collection Address" page is displayed
    And I should see confirm waste collection address page translated

  Scenario: User enters postcode and building number and lands on Waste collection address confirmation page
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Waste collection details" link
    Then the "Whats Waste Collection Address" page is displayed
    And I enter valid waste collection address postcode and building number
    And I click search postcode button
    Then the "Confirm Waste Collection Address" page is displayed
    And I should see the waste collection address matching the postcode and building number
    Then I click save and return button
    Then I should UKWM single journey waste movement page is correctly displayed
    And the UKWM task "Waste collection details" should be "Completed"

  Scenario: User click use this address and continue on Waste collection address confirmation page
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Waste collection details" link
    Then the "Whats Waste Collection Address" page is displayed
    And I enter valid waste collection address postcode and building number
    And I click search postcode button
    Then the "Confirm Waste Collection Address" page is displayed
    And I should see the waste collection address matching the postcode and building number
    And I click the button Use this address and Continue
    Then the "Source of the waste" page is displayed

  Scenario: User navigates to Select waste collection address page and click save ad continue
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Waste collection details" link
    Then the "Whats Waste Collection Address" page is displayed
    And I enter valid waste collection address postcode
    And I click search postcode button
    Then the "Select Waste Collection Address" page is displayed
    And I click the button Save and continue
    Then I remain on the Select Waste Collection Address page with an "Select an address" error message displayed


