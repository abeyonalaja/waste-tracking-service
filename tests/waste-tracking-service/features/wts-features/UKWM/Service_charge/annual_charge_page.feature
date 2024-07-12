@UKMV @ignore
Feature: AS A WTS Data Admin user
  I NEED to be able to initiate payment of the service charge for WTS
  SO THAT I can use the full functionalities of the WTS to fulfill my duty of car

  @translation
  Scenario: User navigates to annual charge page and verifies its translated correctly
    Given I login thru the DCID portal
    When the "Description" page is displayed
    And I click Pay service charge button
    When the "Annual Charge" page is displayed
    Then I should see annual charge page correctly translated
    And I click the cancel button
    Then the "Waste Tracking Landing" page is displayed
    And I verify payment warning banner is displayed

  Scenario: User navigates to GLW app without paying and verify banner presents
    Given I login thru the DCID portal
    When the "Description" page is displayed
    And I click continue without paying button
    Then the "Export Waste From Uk" page is displayed
    And I verify payment warning banner is displayed
    And I verify user have restricted functionalities available
    When I click the "Pay your service charge" link
    Then Annual service charge for GLW is displayed






