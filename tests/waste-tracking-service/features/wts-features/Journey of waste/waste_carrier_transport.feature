@ignore
Feature: AS A waste producer/broker
  I NEED to be able to add a mode transport for my waste
  SO THAT I describe how the waste will be moved to end destination

  @translation
  Scenario: Check waste transport page correctly displayed and back link should have the user back to submit an export page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I complete Waste codes and description task with "Not applicable" has waste code
    And I click the "Waste carriers" link
    Then I should see "waste carrier transport" page is displayed
    And I should see waste carrier transport is correctly translated
    Then I have options "Shipping container"
    And I have options "Trailer"
    And I have options "Bulk vessel"
    And I click "Back" link should display "Submit an export" page

    Scenario: User can't continue without selecting waste carrier transport
      Given I login to waste tracking portal
      When I navigate to the submit an export with reference
      And I complete Waste codes and description task with "Not applicable" has waste code
      And I click the "Waste carriers" link
      And I click the button Save and continue
      Then I remain on the Waste carrier transport page with an "" error message displayed


