@gov_pay @service_charge
Feature: AS A WTS Data Admin user
  I NEED to be able to initiate payment of the service charge for WTS
  SO THAT I can use the full functionalities of the WTS to fulfill my duty of car

  @translation @service_charge
  Scenario: User navigates to annual charge page and verifies its translated correctly
    Given I navigate to service charge page after login on DCID portal
    And I click Pay service charge button
    When the "Annual Charge" page is displayed
    Then I should see annual charge page correctly translated
    And I click the "Cancel" link
    Then the "Account" page is displayed
    And I verify payment warning banner is displayed






