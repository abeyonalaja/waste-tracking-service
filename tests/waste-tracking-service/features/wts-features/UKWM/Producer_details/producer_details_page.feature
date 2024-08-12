@UKMV @ignore
Feature: AS A waste controller
  I NEED to add the producer's contact details
  SO THAT there is a named person to track any producer related queries back to

  @translation
  Scenario: User navigates to Producer contact details page, verify its correctly translated
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Producer organisation address" link
    Then the "Whats producer address" page is displayed
    And I enter valid producer postcode
    And I click search postcode button
    Then the "Select producer address" page is displayed
    And I select first producer address
    Then the "Producer contact details" page is displayed
    And I verify producer contact details page is correctly translated

  Scenario: User navigates to Producer contact details page and completes it
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Producer organisation address" link
    Then the "Whats producer address" page is displayed
    And I enter valid producer postcode
    And I click search postcode button
    Then the "Select producer address" page is displayed
    And I select first producer address
    And I click the button Save and continue
    Then the "Producer contact details" page is displayed
    And I complete the producer contact details page
    And I click the button Save and continue
    # Adding sic code page is displayed

