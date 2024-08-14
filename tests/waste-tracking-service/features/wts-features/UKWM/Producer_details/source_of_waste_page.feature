@UKMV
Feature: AS A waste controller
  I NEED to add the source of the waste
  SO THAT origin of the waste is known

  @translation
  Scenario: User navigates to Source of the waste page and verify its translated correctly
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Source of the waste" link
    Then the "Source of the waste" page is displayed
    And I verify source of the waste page is correctly translated
    And I click the button Save and continue
    Then I remain on the Source of the waste page with an "Select the source of the waste" error message displayed
    And I click save and return button
    Then the UKWM task "Source of the waste" should be "Not started yet"

  Scenario: User navigates to Source of the waste page and select Commercial waste option
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Source of the waste" link
    Then the "Source of the waste" page is displayed
    And I choose "Commercial waste" radio button
    And I click save and return button
    Then the UKWM task "Source of the waste" should be "Completed"

  Scenario: User navigates to Source of the waste page and select Industrial waste option
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Source of the waste" link
    Then the "Source of the waste" page is displayed
    And I choose "Industrial waste" radio button
    And I click save and return button
    Then the UKWM task "Source of the waste" should be "Completed"
    And I click the "Source of the waste" link
    Then I verify previously selected source option is pre-selected

  Scenario: User navigates to Source of the waste page and select Construction and demolition waste option
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Source of the waste" link
    Then the "Source of the waste" page is displayed
    And I choose "Construction and demolition waste" radio button
    And I click save and return button
    Then the UKWM task "Source of the waste" should be "Completed"

  Scenario: User navigates to Source of the waste page and select Household waste option
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Source of the waste" link
    Then the "Source of the waste" page is displayed
    And I choose "Household waste" radio button
    And I click save and return button
    Then the UKWM task "Source of the waste" should be "Completed"

