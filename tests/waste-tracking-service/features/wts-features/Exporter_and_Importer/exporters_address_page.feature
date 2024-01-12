Feature: Exporter address page
  AS A waste producer
  I NEED to add the exporter’s details
  SO THAT the exporter can be tracker

  @translation
  Scenario: Exporter page displayed correctly
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    When I click the "Exporter details" link
    Then the "exporter address" page is displayed
    And I should see Exporter details page correctly translated
    And I click "Back" link should display "task list" page

  @translation
  Scenario: User enters postcode on What’s the exporter’s address page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Exporter details" link
    Then the "exporter address" page is displayed
    When I enter valid postcode
    And I click Find Address button
    Then the "choose exporter address details" page is displayed
    And I should see exporter postcode page is correctly translated

  Scenario: User enters postcode and chose an address
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Exporter details" link
    Then the "exporter address" page is displayed
    And I enter valid postcode
    And I click Find Address button
    Then the "choose exporter address details" page is displayed
    And I choose first address from the list
    And I click the button Save and continue
    Then the "exporter address" page is displayed
    And I should check exporter address is displayed with Change address link on the page

  Scenario: User change already entered address from Change address option
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Exporter details" link
    Then the "Exporter address" page is displayed
    And I enter valid postcode
    And I click Find Address button
    And I choose first address from the list
    And I click the button Save and continue
    Then the "Check Exporter address" page is displayed
    And I should check exporter address is displayed with Change address link on the page
    And I click the "Change" link
    Then the "Exporter address" page is displayed

  @dev_only
  Scenario: User change already entered postcode by using change link
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Exporter details" link
    Then the "exporter address" page is displayed
    When I enter valid postcode
    And I click Find Address button
    When I choose first address from the list
    When I click the button Save and continue
    And I click the "Change" link
    Then I verify the postcode field is displayed with the initial postcode pre-populated

  Scenario: User click on I can not find my address in the list link
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Exporter details" link
    Then the "exporter address" page is displayed
    When I enter valid postcode
    And I click Find Address button
    And I click the "Enter your address manually" link
    Then the "exporter address" page is displayed

  Scenario: User enters invalid postcode on What's the exporter's address page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Exporter details" link
    Then the "exporter address" page is displayed
    When I enter invalid postcode
    And I click Find Address button
    Then I remain on the exporter address page with an "Enter a real postcode" error message displayed

  Scenario: User does not enter postcode on What's the exporter's address page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Exporter details" link
    Then the "exporter address" page is displayed
    And I click Find Address button
    Then I remain on the exporter address page with an "Enter a postcode" error message displayed

  Scenario: User can't continue without selecting an address from the list
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Exporter details" link
    Then the "Exporter address" page is displayed
    When I enter valid postcode
    And I click Find Address button
    And I click the button Save and continue
    Then I remain on the exporter address page with an "Select an address" error message displayed

  @dev_only
  Scenario: User can use building number to find single address
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Exporter details" link
    Then the "Exporter address" page is displayed
    When I enter valid postcode
    And I enter building number or building name
    And I click Find Address button
    Then the "edit exporter address" page is displayed
    And I should see edit exporter address page is correctly translated
    When I click the Save and return to draft
    Then the task "Exporter details" should be "IN PROGRESS"
    When I click the "Exporter details" link
    Then the "exporter address" page is displayed


