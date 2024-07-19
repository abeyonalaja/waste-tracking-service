@gov_pay @service_charge @ignore
Feature: AS A WTS user
  I NEED a payment success confirmation displayed
  SO THAT I know that the service charge payment I made has been successful

  @ignore
  Scenario Outline: Verify different payment type scenarios
    Given I navigate to service charge page after login on DCID portal
    And I click Pay service charge button
    Then the "Annual Charge" page is displayed
    When I click Continue button
    Then I should see enter payment detail page is displayed
    When I enter the payment details for "<payment_type>"
    And I click Continue button
    Then I should see confirm your payment page is displayed
    And I complete the payment process
    Then I should see a "<expected_message>" message

    Examples:
      | payment_type            | expected_message                    |
      | successful_payment      | Payment successful                  |
#      | card_type_not_accepted  | Card type not accepted              |
#      | card_declined           | Card declined                       |
#      | card_expired            | Card expired                        |
#      | invalid_cvc_code        | Invalid CVC code                    |
#      | general_error           | General error                       |

  Scenario Outline: User navigate to payment success page and verify its correctly translated
    Given I navigate to service charge page after login on DCID portal
    And I click Pay service charge button
    Then the "Annual Charge" page is displayed
    When I click Continue button
    Then I should see enter payment detail page is displayed
    When I enter the payment details for "<payment_type>"
    And I click Continue button
    Then I should see confirm your payment page is displayed
    And I complete the payment process
    Then the "Success Payment" page is displayed
    And I see success payment page translated correctly
    Examples:
      | payment_type            | expected_message                    |
      | successful_payment      | Payment successful                  |
