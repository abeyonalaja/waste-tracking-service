@UKMV @ignore
Feature: AS A Waste controller
  I NEED to be able to add a waste producer organisation address detail
  SO THAT I have the address where the waste is coming from captured on the system


  @translation
  Scenario: User navigates to Whats producer address page, verify its correctly translated and enters valid postcode
    Given I login into UKWM app
    When I navigate to the UKWM task list page with reference
    And I click the "Producer organisation address" link
    Then the "Whats producer address" page is displayed
    And I verify whats producer address page is correctly translated
    And I enter valid producer postcode
    And I click search postcode button
    Then the "Select producer address" page is displayed
    And I verify select producer address page is correctly translated

  @translation
  Scenario: User navigates to Whats producer address page and enters postcode which does not return any address
    Given I login into UKWM app
    When I navigate to the UKWM task list page with reference
    And I click the "Producer organisation address" link
    Then the "Whats producer address" page is displayed
    And I verify whats producer address page is correctly translated
    And I enter postcode with 0 addresses
    And I click search postcode button
    Then the "No address found" page is displayed
    And I verify no address found page is correctly translated

  Scenario: User navigates to Whats producer address page and not entering postcode before clicking search button
    Given I login into UKWM app
    When I navigate to the UKWM task list page with reference
    And I click the "Producer organisation address" link
    Then the "Whats producer address" page is displayed
    And I click search postcode button
    Then I remain on the Whats producer address page with an "<string>" error message displayed




