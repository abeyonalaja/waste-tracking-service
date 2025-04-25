@UKMV @enter_producer_address
Feature: AS A Waste controller
  I NEED to be able to add a waste producer organisation address detail manually
  SO THAT I have the address where the waste is coming from captured on the system

  @translation
  Scenario: User navigates to Enter Producer Address Manual page, verify its correctly translated and when navigate to confirm producer page should see correct address
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Producer organisation address" link
    Then the "Whats producer address" page is displayed
    And I click the "Or enter the address manually" link
    Then the "Enter Producer Address Manual" page is displayed
    And I verify manual entry page is translated correctly
    Then I complete the Enter Producer Address Manual page
    And I click the button Save and continue
    Then the "confirm producer address" page is displayed
    And I should see Producer address correctly displayed on confirm producer address page

  Scenario: User can't continue for Producer manual entry page without completing all the mandatory fields
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Producer organisation address" link
    Then the "Whats producer address" page is displayed
    And I click the "Or enter the address manually" link
    Then the "Enter Producer Address Manual" page is displayed
    When I click the button Save and continue
    And I remain on the Enter Producer Address Manual page with an "Enter address line 1" error message displayed
    And I remain on the Enter Producer Address Manual page with an "Enter a town or city" error message displayed
    And I remain on the Enter Producer Address Manual page with an "Select a country" error message displayed
    When I enter invalid postcode
    When I click save and return button
    And I remain on the Enter Producer Address Manual page with an "Enter a real postcode" error message displayed


  Scenario: User can save and return for Producer manual entry page without completing all the mandatory fields
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Producer organisation address" link
    Then the "Whats producer address" page is displayed
    And I click the "Or enter the address manually" link
    Then the "Enter Producer Address Manual" page is displayed
    When I click save and return button
    And the UKWM task "Producer organisation address" should be "In progress"
    When I click the "Producer organisation address" link
    Then the "edit producer address" page is displayed

  Scenario: User can return to edit Producer organisation address page after confirming the address
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Producer organisation address" link
    Then the "Whats producer address" page is displayed
    And I click the "Or enter the address manually" link
    Then the "Enter Producer Address Manual" page is displayed
    Then I complete the Enter Producer Address Manual page
    And I click the button Save and continue
    Then the "confirm producer address" page is displayed
    When I click the button Use this address and Continue
    Then the "producer contact details" page is displayed
    When I click save and return button
    And the UKWM task "Producer organisation address" should be "Completed"
    When I click the "Producer organisation address" link
    Then the "edit producer address" page is displayed
    And I should see previously entered producer address pre-populated
    When I update the producer country address to "Scotland"
    And I click the button Save and continue
    And I should see Producer address correctly displayed on confirm producer address page









