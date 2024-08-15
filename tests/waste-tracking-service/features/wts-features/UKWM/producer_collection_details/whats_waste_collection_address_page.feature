@UKMV
Feature: AS A Waste controller
  I NEED to be able to add a different waste collection address
  SO THAT I have the address of where the waste is going to be picked from on the system

  @translation
  Scenario: User navigates to Whats waste collection address page, verify its correctly translated and enters invalid postcode
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Waste collection details" link
    Then the "Whats Waste Collection Address" page is displayed
    And I verify waste collection address page is translated correctly
    And I click search postcode button
    Then I remain on the Whats Waste Collection Address page with an "Enter a postcode" error message displayed
    And I enter invalid address postcode
    And I click the button Save and continue
    Then I remain on the Whats Waste Collection Address page with an "Enter a real postcode" error message displayed


  @translation
  Scenario: User navigates to Whats waste collection address page enters valid postcode
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Waste collection details" link
    Then the "Whats Waste Collection Address" page is displayed
    And I enter valid waste collection address postcode
    And I click search postcode button
    Then the "Select Waste Collection Address" page is displayed
    And I verify select waste collection address page is correctly translated

  Scenario: User navigates to select address from Select address page and click save and return
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Waste collection details" link
    Then the "Whats Waste Collection Address" page is displayed
    And I enter valid waste collection address postcode
    And I click search postcode button
    Then the "Select Waste Collection Address" page is displayed
    And I select first waste collection address
    And I click save and return button
    Then the UKWM task "Waste collection details" should be "In progress"

  Scenario: User navigates to Whats waste collection address page and enters postcode which does not return any address
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Waste collection details" link
    Then the "Whats Waste Collection Address" page is displayed
    And I enter postcode with 0 addresses
    And I click search postcode button
    Then the "No address found" page is displayed

