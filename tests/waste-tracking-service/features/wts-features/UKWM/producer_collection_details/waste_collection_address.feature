@UKMV
Feature: Waste collection address pages

  @translation
  Scenario: Waste collection address same as producer address and task status is set to complete
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Producer organisation address" link
    And I complete producer organisation address with postcode search
    When I click the "Waste collection details" link
    Then I should see Do you want to use producer address as waste collection page is displayed
    And I should see Do you want to use producer address as waste collection page is translated correctly
    And I should see Producer address correctly displayed on Do you want to use producer address as waste collection page is displayed
    And I choose "Yes, I want to use this address for the waste collection" radio button
    And I click the button Save and continue
    Then I should see confirm waste collection address page displayed
    And I should see Waste collection address correctly displayed on confirm waste collection address page is displayed
    And I click the button Use this address and Continue
    And I click save and return button
    And the UKWM task "Waste collection details" should be "Completed"

    #defect-429486
  @translation @ignore
  Scenario: Waste collection address not same as producer address, user enter address manually and task set to complete
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Producer organisation address" link
    And I complete producer organisation address with postcode search
    When I click the "Waste collection details" link
    And I choose "No, I want to enter a different address for the waste collection" radio button
    And I click the button Save and continue
    Then the "Whats Waste Collection Address" page is displayed
    When I click the "Or enter the address manually" link
    Then the "Enter waste collection address Manual" page is displayed
    And I verify collection address manual entry page is translated correctly
    Then I complete the Enter waste collection Address Manual page
    And I click the button Save and continue
    Then the "Confirm Waste Collection Address" page is displayed
    And I should see waste collection address correctly displayed on confirm waste collection address page
    When I click save and return button
    And the UKWM task "Waste collection details" should be "In progress"
    When I click the "Waste collection details" link
    Then the "edit waste collection address" page is displayed
    And I should see previously entered waste collection address pre-populated
    When I update the waste collection country address to "Scotland"
    And I click save and return button
    And the UKWM task "Waste collection details" should be "In progress"
    When I click the "Waste collection details" link
    And I click the button Save and continue
    And I should see waste collection address correctly displayed on confirm waste collection address page
    And I click the button Use this address and Continue
    And I click save and return button
    And the UKWM task "Waste collection details" should be "Completed"

  Scenario: User can update waste collection after selecting same address as Producer address
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Producer organisation address" link
    And I complete producer organisation address with postcode search
    When I click the "Waste collection details" link
    Then I should see Do you want to use producer address as waste collection page is displayed
    And I should see Producer address correctly displayed on Do you want to use producer address as waste collection page is displayed
    And I choose "Yes, I want to use this address for the waste collection" radio button
    And I click the button Save and continue
    And I click the button Use this address and Continue
    And I click save and return button
    And the UKWM task "Waste collection details" should be "Completed"
    When I click the "Waste collection details" link
    Then the "edit waste collection address" page is displayed
    When I clear city and town input field
    And I click save and return button
    And the UKWM task "Waste collection details" should be "In progress"

  Scenario: User can't continue for Waste collection manual entry page without completing all the mandatory fields
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Waste collection details" link
    Then the "Whats Waste Collection Address" page is displayed
    And I click the "Or enter the address manually" link
    Then the "Enter waste collection address Manual" page is displayed
    When I click the button Save and continue
    And I remain on the Enter Waste Collection Address Manual page with an "Enter address line 1" error message displayed
    And I remain on the Enter Waste Collection Address Manual page with an "Enter a town or city" error message displayed
    And I remain on the Enter Waste Collection Address Manual page with an "Select a country" error message displayed
    When I enter invalid postcode
    When I click save and return button
    And I remain on the Enter Waste Collection Address Manual page with an "Enter a postcode" error message displayed

  Scenario: User can't continue for Waste collection manual entry page if enter max data for input fields
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    When I click the "Waste collection details" link
    Then the "Whats Waste Collection Address" page is displayed
    When I click the "Or enter the address manually" link
    Then the "Enter waste collection address Manual" page is displayed
    And I enter values which exceed the allowed number of characters for the address fields
    And I click the button Save and continue
    Then I remain on the Enter Waste Collection Address Manual page with an "Building name or number must be less than 250 characters" error message displayed
    Then I remain on the Enter Waste Collection Address Manual page with an "Address line 1 must be less than 250 characters" error message displayed
    Then I remain on the Enter Waste Collection Address Manual page with an "Address line 2 must be less than 250 characters" error message displayed
    Then I remain on the Enter Waste Collection Address Manual page with an "Town or city must be less than 250 characters" error message displayed
    Then I remain on the Enter Waste Collection Address Manual page with an "Enter a postcode" error message displayed
    Then I remain on the Enter Waste Collection Address Manual page with an "Select a country" error message displayed

  Scenario: Waste collection details task remains not started if user click save and return on manual entry page
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    When I click the "Waste collection details" link
    Then the "Whats Waste Collection Address" page is displayed
    When I click the "Or enter the address manually" link
    And I click save and return button
    And the UKWM task "Waste collection details" should be "In Progress"

    #defect-429486
  @ignore
  Scenario: Waste collection address same as producer address and can change the address from confirm address page
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Producer organisation address" link
    And I complete producer organisation address with postcode search
    When I click the "Waste collection details" link
    Then I should see Do you want to use producer address as waste collection page is displayed
    And I should see Do you want to use producer address as waste collection page is translated correctly
    And I should see Producer address correctly displayed on Do you want to use producer address as waste collection page is displayed
    And I choose "Yes, I want to use this address for the waste collection" radio button
    And I click the button Save and continue
    Then I should see confirm waste collection address page displayed
    When I click the "Use a different address" link
    Then the "Whats Waste Collection Address" page is displayed
    And I enter valid waste collection address postcode and building number
    And I click search postcode button
    Then the "Confirm Waste Collection Address" page is displayed
    And I should see the waste collection address matching the postcode and building number
    Then I click save and return button
    Then I should see UKWM waste reference on task list page
    And the UKWM task "Waste collection details" should be "Completed"

