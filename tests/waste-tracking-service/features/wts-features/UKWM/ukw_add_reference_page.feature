@UKMV @ignore
Feature: AS A waste controller
  I NEED to be able to add my unique reference ID to a waste record
  SO THAT I can easily retrieve the waste record

  @translation
  Scenario: User navigates to UKM add reference page and verifies they are translated
    Given I login into UKWM app
    When the "UKWM Home" page is displayed
    And I click the "Create a new waste movement" link
    Then the "Ukwm Add Reference" page is displayed
    And I verify ukw add reference page is correctly translated

  Scenario: User navigates to UKM add reference page, enters valid reference and lands on Task list page
    Given I login into UKWM app
    When the "UKWM Home" page is displayed
    And I click the "Create a new waste movement" link
    Then the "Ukwm Add Reference" page is displayed
    And I enter valid ukw reference
    And I click the button Save and continue
    # Then the "Ukwm Task List" page is displayed

  Scenario: User navigates to UKM add reference page and not enter reference
    Given I login into UKWM app
    When the "UKWM Home" page is displayed
    And I click the "Create a new waste movement" link
    Then the "Ukwm Add Reference" page is displayed
    And I click the button Save and continue
    Then I remain on the Ukwm Add Reference page with an "Enter a unique reference" error message displayed

  Scenario: User navigates to UKM add reference page and enters reference with more than 20 chars
    Given I login into UKWM app
    When the "UKWM Home" page is displayed
    And I click the "Create a new waste movement" link
    Then the "Ukwm Add Reference" page is displayed
    And I enter ukw reference with more than 20 chars
    And I click the button Save and continue
    Then I remain on the Ukwm Add Reference page with an "The unique reference must be 20 characters or less" error message displayed

  Scenario: User navigates to UKM add reference page and enters reference containing special chars
    Given I login into UKWM app
    When the "UKWM Home" page is displayed
    And I click the "Create a new waste movement" link
    Then the "Ukwm Add Reference" page is displayed
    And I enter ukw reference with special chars
    And I click the button Save and continue
    Then I remain on the Ukwm Add Reference page with an "The unique reference can only contain letters, numbers, hyphens, slashes, underscores and spaces" error message displayed
