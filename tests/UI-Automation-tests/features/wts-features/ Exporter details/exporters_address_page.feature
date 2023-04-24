Feature: AS A waste producer
  I NEED to add the exporter’s details
  SO THAT the exporter can be tracker

  @translation
  Scenario: Exporter page displayed correctly
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    When I click the "Exporter details" link
    Then the "exporter address" page is displayed
    And I should see page correctly translated
    And I click "Back" link should display "Submit an export" page

