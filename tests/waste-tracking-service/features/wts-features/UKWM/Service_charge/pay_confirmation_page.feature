@UKMV @ignore
Feature: AS A WTS user
  I NEED to be able to pay the service charge for WTS
  SO THAT I can use the full functionalities of the WTS to fulfill my duty of care

  @translation
  Scenario: User navigates to pay confirmation page and verify its translated correctly
    Given I login thru the DCID portal
    When the "Description" page is displayed
    And I click Pay service charge button
    When the "Annual Charge" page is displayed
    And I click Continue button
    Then I complete card details page
    And the "Confirm Your Payment" page is displayed
    And I verify Confirm your payment page is translated correctly
    And I verify correct payment details are displayed


  Scenario: User navigates to pay confirmation page and click cancel link
    Given I login thru the DCID portal
    When the "Description" page is displayed
    And I click Pay service charge button
    When the "Annual Charge" page is displayed
    And I click Continue button
    Then I complete card details page
    And the "Confirm Your Payment" page is displayed
    And I verify correct payment details are displayed
    When I click the "Cancel payment" link
    Then the "Cancel Payment" page is displayed
    And I verify cancel payment page is correctly translated
