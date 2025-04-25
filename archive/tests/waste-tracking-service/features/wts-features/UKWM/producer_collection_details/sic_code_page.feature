@UKMV
Feature: SIC code page

  @translation
  Scenario: User navigates to SIC code page and verify its translated correctly
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Producer SIC code" link
    Then the "Sic code" page is displayed
    And I verify sic code page is translated correctly
    And I select a SIC code
    And I click the button Save and continue
    Then the "Sic Code List" page is displayed

  Scenario: User navigates to SIC code page, add code and click save and continue
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Producer SIC code" link
    Then the "Sic code" page is displayed
    And I select a SIC code
    And I click the button Save and continue
    And I choose "No" radio button
    And I click the button Save and continue
    Then the "Whats Waste Collection Address" page is displayed

  Scenario: User navigates to SIC code page and not selecting a SIC code
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Producer SIC code" link
    Then the "Sic code" page is displayed
    And I click the button Save and continue
    Then I remain on the Sic code page with an "Enter a code" error message displayed

  Scenario: User navigates to SIC code page and add same SIC code twice
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Producer SIC code" link
    Then the "Sic code" page is displayed
    And I select a SIC code
    And I click the button Save and continue
    Then the "Sic Code List" page is displayed
    And I choose "Yes" radio button
    And I select a SIC code
    And I click the button Save and continue
    Then I remain on the Sic Code List page with an "You have already added this SIC code" error message displayed

  Scenario: User navigates add SIC code, then remove it
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Producer SIC code" link
    Then the "Sic code" page is displayed
    And I select a SIC code
    And I click the button Save and continue
    And I click the "Remove" link
    Then the "Remove Sic code" page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then the "Sic code" page is displayed

