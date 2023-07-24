@add_reference_number
Feature: AS A Waste Producer/Broker
  I NEED to submit an Annex 7 form
  AND I want add my own reference to my export
  SO THAT my waste can be processed

  Scenario: Display page breadcrumbs
    Given I login to waste tracking portal
    When I navigate to the add reference page
    And I see the breadcrumb Waste tracking service, Green list waste overview, Your reference displayed
    When I click Green list waste overview from the breadcrumb
    Then Green list overview page is displayed

  Scenario: Saving reference in the front end
    Given I login to waste tracking portal
    When I navigate to the add reference page
    And I have selected Yes and entered my reference
    And I click browser back button
    Then I should see reference number pre-populated

  Scenario: Proceeding without a reference
    Given I login to waste tracking portal
    And I navigate to the add reference page
    When I have selected the No option
    And I click the button Save and continue
    Then Submit an export page is displayed

  Scenario: Error for no selection for unique reference
    Given I login to waste tracking portal
    And I navigate to the add reference page
    When I have neither selected the Yes or No option
    And I click the button Save and continue
    Then I remain on the Add Reference Number page with an "Select yes if you want to add a reference" error message displayed

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

  Scenario: Error messages for entering reference longer than 20 characters
    Given I login to waste tracking portal
    And I navigate to the add reference page
    When  I have entered an invalid reference containing more than 20 characters
    And I click the button Save and continue
    Then I remain on the Add Reference Number page with an "Enter a reference using 20 character or less" error message displayed
