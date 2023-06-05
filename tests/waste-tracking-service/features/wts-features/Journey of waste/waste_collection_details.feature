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
#    And I click the button Save and continue
#    Then I remain on the exporter address page with an "Select an address" error message displayed
