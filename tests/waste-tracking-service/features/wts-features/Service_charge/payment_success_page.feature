@gov_pay @service_charge @ignore
Feature: AS A WTS user
  I NEED a payment success confirmation displayed
  SO THAT I know that the service charge payment I made has been successful

  Scenario: Maestro Payment Card not  support message
    Given I navigate to service charge page after login on DCID portal
    And I click Pay service charge button
    Then the "Annual Charge" page is displayed
    When I click Continue button
    Then I should see enter payment detail page is displayed
    When I enter the payment details for "card_type_not_accepted"
    And I click Continue button
    Then I should see "This card type is not accepted" error message displayed
    And I should see "Maestro is not supported" error message displayed
    When I click the Cancel payment link
    And I click Continue button
    Then the "Waste Tracking Landing" page is displayed
    And I verify payment warning banner is displayed

  Scenario: Verify Card declined scenario
    Given I navigate to service charge page after login on DCID portal
    And I click Pay service charge button
    Then the "Annual Charge" page is displayed
    When I click Continue button
    Then I should see enter payment detail page is displayed
    When I enter the payment details for "card_declined"
    And I click Continue button
    And I click Continue button
    Then the "Waste Tracking Landing" page is displayed
    And I verify payment warning banner is displayed

  Scenario: Verify card expired scenario
    Given I navigate to service charge page after login on DCID portal
    And I click Pay service charge button
    Then the "Annual Charge" page is displayed
    When I click Continue button
    Then I should see enter payment detail page is displayed
    When I enter the payment details for "card_expired"
    And I click Continue button
    And I click Continue button
    Then the "Waste Tracking Landing" page is displayed
    And I verify payment warning banner is displayed

  Scenario: Verify invalid csv scenario
    Given I navigate to service charge page after login on DCID portal
    And I click Pay service charge button
    Then the "Annual Charge" page is displayed
    When I click Continue button
    Then I should see enter payment detail page is displayed
    When I enter the payment details for "invalid_cvc_code"
    And I click Continue button
    And I click Continue button
    Then the "Waste Tracking Landing" page is displayed
    And I verify payment warning banner is displayed

  Scenario: Verify general error scenario and check if user can redirected to account page
    Given I navigate to service charge page after login on DCID portal
    And I click Pay service charge button
    Then the "Annual Charge" page is displayed
    When I click Continue button
    Then I should see enter payment detail page is displayed
    When I enter the payment details for "general_error"
    And I click Continue button
    And I click the Cancel and go back to try the payment again link
    Then the "Waste Tracking Landing" page is displayed
    And I verify payment warning banner is displayed

    #not running this scenario in the pipeline since we can't rerun the DCID user.
  @ignore @manual
  Scenario: Verify payment success page and verify its correctly translated
    Given I navigate to service charge page after login on DCID portal
    And I click Pay service charge button
    Then the "Annual Charge" page is displayed
    When I click Continue button
    Then I should see enter payment detail page is displayed
    When I enter the payment details for "successful_payment"
    And I click Continue button
    Then I should see confirm your payment page is displayed
    And I complete the payment process
    Then the "Success Payment" page is displayed
    And I see success payment page translated correctly

