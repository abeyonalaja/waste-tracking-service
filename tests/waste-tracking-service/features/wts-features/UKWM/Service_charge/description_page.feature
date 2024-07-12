@UKMV @ignore
Feature: AS A WTS user
  I NEED a service charge description page
  SO THAT I know what will be permissible within the Waste tracking service after paying the service charge

  @translation
  Scenario: User navigates to description page and verifies its translated correctly
    Given I login thru the DCID portal
    When the "Description" page is displayed
    Then I should see description page correctly translated
    And I click Continue without payment button
    Then the "Waste Tracking Landing" page is displayed
    And I verify payment warning banner is displayed
    And I click the "Pay your service charge" link
    Then the "Description" page is displayed

