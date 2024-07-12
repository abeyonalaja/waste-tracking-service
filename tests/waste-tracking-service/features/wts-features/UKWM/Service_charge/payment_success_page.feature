@UKMV @ignore
Feature: AS A WTS user
  I NEED a payment success confirmation displayed
  SO THAT I know that the service charge payment I made has been successful

  @translation
  Scenario: User navigates to payment success page and verify its translated correctly
    Given I login thru the DCID portal
    When the "Description" page is displayed
    And I click Pay service charge button
    When the "Annual Charge" page is displayed
    And I click Continue button
    Then I complete card details page
    And the "Confirm Your Payment" page is displayed
    And I verify correct payment details are displayed
    When I click confirm payment button
    Then the "Success Payment" page is displayed
    And I verify success payment page is correctly translated
    When I click the "Go to the waste tracking service" link
    Then the "Waste Tracking Landing" page is displayed

