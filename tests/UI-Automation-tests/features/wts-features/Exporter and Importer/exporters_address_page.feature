Feature: AS A waste producer
  I NEED to add the exporter’s details
  SO THAT the exporter can be tracker

  @translation
  Scenario: Exporter page displayed correctly
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    When I click the "Exporter details" link
    Then the "exporter address" page is displayed
    And I should see Exporter details page correctly translated
    And I click "Back" link should display "Submit an export" page

  @translation
  Scenario: User enters postcode on What’s the exporter’s address page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Exporter details" link
    Then the "exporter address" page is displayed
    When I enter valid postcode
    And I click Find Address button
    And I should see exporter postcode page is correctly translated

  Scenario: User enters postcode and chose an address
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Exporter details" link
    Then the "exporter address" page is displayed
    And I enter valid postcode
    And I click Find Address button
    And I select first address from the lookup
    And I click the button Save and continue
    Then the "exporter address" page is displayed
    And I should selected address is displayed with Change address link on the page

  Scenario: User change already entered address from Change address option
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Exporter details" link
    Then the "Exporter address" page is displayed
    And I enter valid postcode
    And I click Find Address button
    And I select first address from the lookup
    And I click the button Save and continue
    Then the "Exporter details" page is displayed
    And I should selected address is displayed with Change address link on the page
    And I click the "Change address" link
    Then the "Exporter address" page is displayed

  Scenario: User change already entered postcode by using change link
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Exporter details" link
    Then the "exporter address" page is displayed
    When I enter valid postcode
    And I click Find Address button
    And I click the "Change" link
    Then I verify the postcode field is displayed with the initial postcode pre-populated

  Scenario: User click on I can not find my address in the list link
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Exporter details" link
    Then the "exporter address" page is displayed
    When I enter valid postcode
    And I click Find Address button
    And I click the "I cannot find my address in the list" link
    Then the "exporter address" page is displayed

  Scenario: User enters invalid postcode on What's the exporter's address page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Exporter details" link
    Then the "exporter address" page is displayed
    When I enter invalid postcode
    And I click Find Address button
    Then I remain on the exporter address page with an "Enter a real postcode" error message displayed

  Scenario: User does not enter postcode on What's the exporter's address page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Exporter details" link
    Then the "exporter address" page is displayed
    And I click Find Address button
    Then I remain on the exporter address page with an "Enter a postcode" error message displayed

  Scenario: User can't continue without selecting an address from the list
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Exporter details" link
    Then the "Exporter address" page is displayed
    When I enter valid postcode
    And I click Find Address button
    And I click the button Save and continue
    Then I remain on the exporter address page with an "Select an address" error message displayed


