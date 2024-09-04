@UKMV
Feature: AS A waste controller
  I NEED to add the carrier's contact details
  SO THAT there is a named person to track any carrier-related queries back to

  @translation
  Scenario: User navigates to Carrier contact details page, verify its correctly translated
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Carrier contact details" link
    Then the "Carrier Contact Details" page is displayed
    And I verify Carrier contact details page is correctly translated

  Scenario: User navigates to Carrier contact details page,completes it and verify data is saved correctly
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Carrier contact details" link
    And I complete the Carrier contact details page
    And I click save and return button
    And the UKWM task "Carrier contact details" should be "Completed"
    Then I click the "Carrier contact details" link
    And I should see previously entered carrier contact details pre-populated

  Scenario: User navigates to Carrier contact details page and overwrites the old data with new entries
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Carrier contact details" link
    And I complete the Carrier contact details page
    And I click save and return button
    And the UKWM task "Carrier contact details" should be "Completed"
    Then I click the "Carrier contact details" link
    And I should see previously entered carrier contact details pre-populated
    And I complete the carrier contact details page with new entries
    And I click save and return button
    And the UKWM task "Carrier contact details" should be "Completed"
    Then I click the "Carrier contact details" link
    And I should see previously entered carrier contact details pre-populated

  Scenario: User navigates to Carrier contact details page and completes it partially
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Carrier contact details" link
    And I complete Carrier contact details page partially
    And I click save and return button
    And the UKWM task "Carrier contact details" should be "In progress"
    Then I click the "Carrier contact details" link
    And I should see previously entered partially producer contact details pre-populated

  Scenario: User navigates to Carrier contact details page and click save and continue without entering any data
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Carrier contact details" link
    Then the "Carrier contact details" page is displayed
    And I click the button Save and continue
    Then I remain on the Carrier contact details page with an "Enter an organisation name" error message displayed
    Then I remain on the Carrier contact details page with an "Enter an organisation contact person" error message displayed
    Then I remain on the Carrier contact details page with an "Enter an email address" error message displayed
    Then I remain on the Carrier contact details page with an "Enter a phone number" error message displayed

  Scenario: User navigates to Carrier contact details page and enters invalid fax number
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Carrier contact details" link
    Then the "Carrier contact details" page is displayed
    And I click the button Save and continue
    And I enter invalid fax number for carrier contact details
    And I click the button Save and continue
    Then I remain on the Carrier contact details page with an "Enter a fax number only using numbers, spaces, dashes, pluses and brackets" error message displayed

  Scenario: User navigates to Carrier contact details page and enter more characters than allowed for the input fields
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Carrier contact details" link
    Then the "Carrier contact details" page is displayed
    And I enter values which exceed the allowed number of characters for the fields
    And I click the button Save and continue
    Then I remain on the Carrier contact details page with an "The organisation name can only be 250 characters or less" error message displayed
    Then I remain on the Carrier contact details page with an "The organisation contact person can only be 250 characters or less" error message displayed
    Then I remain on the Carrier contact details page with an "The organisation contact email can only be 250 characters or less" error message displayed
