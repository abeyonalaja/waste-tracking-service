Feature: AS A waste producer/broker
  I NEED to add waste collection details
  SO THAT the waste movement can be tracked appropriately

  @translation
  Scenario: Exporter page displayed correctly
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    When I click the "Waste collection details" link
    Then the "Waste collection details" page is displayed
    And I should see Waste collection details page correctly translated
    And I click "Back" link should display "Submit an export" page

  Scenario: User enters invalid postcode on waste collection details page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    When I click the "Waste collection details" link
    Then the "Waste collection details" page is displayed
    When I enter invalid postcode
    And I click Find Address button
    Then I remain on the Waste collection details page with an "Enter a real postcode" error message displayed
    When I click Return to draft button
    Then the "submit an export" page is displayed

  Scenario: User does not enter postcode on waste collection details page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    When I click the "Waste collection details" link
    Then the "Waste collection details" page is displayed
    And I click Find Address button
    Then I remain on the Waste collection details page with an "Enter a postcode" error message displayed

  Scenario: User can't continue without selecting an address from the list
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    When I click the "Waste collection details" link
    Then the "Waste collection details" page is displayed
    When I enter valid postcode
    And I click Find Address button
    And I click the button Save and continue
    Then I remain on the Waste collection details page with an "Select an address" error message displayed

  Scenario: User select address from dropdown and click Save and continue
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    When I click the "Waste collection details" link
    Then the "Waste collection details" page is displayed
    When I enter valid postcode
    And I click Find Address button
    And I chose first option from the dropdown list
    And I click the button Save and continue
    Then  I should see "Contact details collection address" page is displayed
    And I should see selected address displayed with Change address link on the page
    And I click "Back" link should display "Waste collection details" page

  Scenario: User changes already entered postcode
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    When I click the "Waste collection details" link
    Then the "Waste collection details" page is displayed
    When I enter valid postcode
    And I click Find Address button
    And I click the "Change" link
    Then the "Waste collection details" page is displayed
    And I can see previously entered postcode pre-populated

  Scenario: User navigates back from Contact details collection page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    When I click the "Waste collection details" link
    Then the "Waste collection details" page is displayed
    When I enter valid postcode
    And I click Find Address button
    And I chose first option from the dropdown list
    And I click the button Save and continue
    Then  I should see "Contact details collection address" page is displayed
    And I click "Back" link should display "Waste collection details" page

  Scenario: User completes Contact details collection address page and click save and continue
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    When I click the "Waste collection details" link
    Then the "Waste collection details" page is displayed
    When I enter valid postcode
    And I click Find Address button
    And I chose first option from the dropdown list
    And I click the button Save and continue
    Then  I should see "Contact details collection address" page is displayed
    And I complete the Contact details collection page
    And I click the button Save and continue
    Then I should see "Location waste leaves the UK" page is displayed

  # This sceanrio is failing when run in headless mode Need to check this scenario
  @ignore
  Scenario: User completes Contact details collection address page and click save and return
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    When I click the "Waste collection details" link
    Then the "Waste collection details" page is displayed
    When I enter valid postcode
    And I click Find Address button
    And I chose first option from the dropdown list
    And I click the button Save and continue
    Then  I should see "Contact details collection address" page is displayed
    And I complete the Contact details collection page
    And I click the Save and return to draft
    Then  I should see "Submit an export" page is displayed
    And the task "Waste collection details" should be "COMPLETED"
    And I click the "Waste collection details" link
    Then  I should see "Contact details collection address" page is displayed
    And I should see previously entered waste collection details pre-populated

  Scenario: User select address from dropdown and click Save and Return to draft
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    When I click the "Waste collection details" link
    Then the "Waste collection details" page is displayed
    When I enter valid postcode
    And I click Find Address button
    And I chose first option from the dropdown list
    And I click the Save and return to draft
    Then I should see "Submit an export" page is displayed
    And the task "Waste collection details" should be "IN PROGRESS"

  Scenario: Error validation on Contact details collection address page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    When I click the "Waste collection details" link
    Then the "Waste collection details" page is displayed
    When I enter valid postcode
    And I click Find Address button
    And I chose first option from the dropdown list
    And I click the button Save and continue
    Then  I should see "Contact details collection address" page is displayed
    And I click the button Save and continue
    Then I remain on the Contact details collection address page with an "Enter an organisation name" error message displayed
    And I remain on the Contact details collection address page with an "Enter a full name" error message displayed
    And I remain on the Contact details collection address page with an "Enter a real email address" error message displayed
    And I remain on the Contact details collection address page with an "Enter a real phone number" error message displayed
