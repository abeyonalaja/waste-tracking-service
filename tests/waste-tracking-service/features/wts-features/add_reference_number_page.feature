@add_reference_number
Feature: AS A Waste Producer/Broker
  I NEED to submit an Annex 7 form
  AND I want add my own reference to my export
  SO THAT my waste can be processed

  Scenario: Display page breadcrumbs
    Given I login to waste tracking portal
    When I navigate to the add reference page
    Then I should see enter reference page correctly translated
    When I click Export waste from the UK from the breadcrumb
    Then Export waste from UK page is displayed

  Scenario: Saving reference in the front end
    Given I login to waste tracking portal
    When I navigate to the add reference page
    And I have entered my reference
    And I see the breadcrumb Waste tracking service, Green list waste overview, Your reference displayed
    And I click browser back button
    Then I should see reference number pre-populated

  Scenario: Error for entering 1 character
    Given I login to waste tracking portal
    And I navigate to the add reference page
    When I have entered less than the required character length
    And I click the button Save and continue
    Then I remain on the Add Reference Number page with an "Enter a reference using more than 1 character" error message displayed

  Scenario: Error messages for an invalid special character
    Given I login to waste tracking portal
    And I navigate to the add reference page
    When  I have entered an invalid special character as part of the reference
    And I click the button Save and continue
    Then I remain on the Add Reference Number page with an "The reference must only include letters a to z, numbers, spaces, hyphens and back slashes" error message displayed

  Scenario: Error messages for entering empty spaces
    Given I login to waste tracking portal
    And I navigate to the add reference page
    When I click the button Save and continue
    Then I remain on the Add Reference Number page with an "Enter a reference" error message displayed
