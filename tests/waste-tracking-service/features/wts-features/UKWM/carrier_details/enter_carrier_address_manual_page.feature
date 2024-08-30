@UKMV @enter_carrier_address
Feature: AS A Waste controller
  I NEED to be able to add a waste carrier address detail manually
  SO THAT I have the address where the waste is coming from captured on the system

  @translation
  Scenario: User navigates to Enter Carrier Address Manual page, verify its correctly translated and when navigate to confirm carrier page should see correct address
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Carrier address" link
    Then the "Whats Carrier address" page is displayed
    And I click the "Or enter the address manually" link
    Then the "Enter Carrier Address Manual" page is displayed
    And I verify carrier address manual entry page is translated correctly
    Then I complete the Enter Carrier Address Manual page
    And I click the button Save and continue
    Then the "confirm Carrier address" page is displayed
    And I should see Carrier address correctly displayed on confirm Carrier address page

  Scenario: User can't continue for Carrier manual entry page without completing all the mandatory fields
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Carrier address" link
    Then the "Whats Carrier address" page is displayed
    And I click the "Or enter the address manually" link
    Then the "Enter Carrier Address Manual" page is displayed
    When I click the button Save and continue
    And I remain on the Enter Carrier Address Manual page with an "Enter address line 1" error message displayed
    And I remain on the Enter Carrier Address Manual page with an "Enter a town or city" error message displayed
    And I remain on the Enter Carrier Address Manual page with an "Select a country" error message displayed
    When I enter invalid postcode
    When I click save and return button
    And I remain on the Enter Carrier Address Manual page with an "Enter a real postcode" error message displayed

  Scenario: User can save and return for Carrier manual entry page without completing all the mandatory fields
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Carrier address" link
    Then the "Whats Carrier address" page is displayed
    And I click the "Or enter the address manually" link
    Then the "Enter Carrier Address Manual" page is displayed
    When I click save and return button
    And the UKWM task "Carrier address" should be "In progress"
    When I click the "Carrier address" link
    Then the "edit Carrier address" page is displayed

  Scenario: User can return to edit Carrier organisation address page after confirming the address
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Carrier address" link
    Then the "Whats Carrier address" page is displayed
    And I click the "Or enter the address manually" link
    Then the "Enter Carrier Address Manual" page is displayed
    Then I complete the Enter Carrier Address Manual page
    And I click the button Save and continue
    Then the "confirm Carrier address" page is displayed
    When I click the button Use this address and Continue
    Then the "Carrier contact details" page is displayed
    When I click save and return button
    And the UKWM task "Carrier address" should be "Completed"
    When I click the "Carrier address" link
    Then the "Edit Carrier address" page is displayed
    And I should see previously entered Carrier address pre-populated
    When I update the Carrier country address to "Scotland"
    And I click the button Save and continue
    And I should see Carrier address correctly displayed on confirm Carrier address page

  Scenario: User can't continue from carrier manual entry page if enter max data for input fields
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Carrier address" link
    Then the "Whats Carrier address" page is displayed
    And I click the "Or enter the address manually" link
    Then the "Enter Carrier Address Manual" page is displayed
    And I enter values which exceed the allowed number of characters for the address fields
    And I click the button Save and continue
    Then I remain on the Enter Carrier Address Manual page with an "Building name or number must be less than 250 characters" error message displayed
    Then I remain on the Enter Carrier Address Manual page with an "Address line 1 must be less than 250 characters" error message displayed
    Then I remain on the Enter Carrier Address Manual page with an "Address line 2 must be less than 250 characters" error message displayed
    Then I remain on the Enter Carrier Address Manual page with an "Town or city must be less than 250 characters" error message displayed
    Then I remain on the Enter Carrier Address Manual page with an "Enter a valid postcode" error message displayed
    Then I remain on the Enter Carrier Address Manual page with an "Select a country" error message displayed










