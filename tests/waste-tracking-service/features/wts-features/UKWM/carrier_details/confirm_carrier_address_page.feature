@UKMV @enter_carrier_address
Feature: AS A Waste controller
  I NEED to be able to confirm the carrier's address
  SO THAT I can ensure the correct address is being used for the Carrier

  Scenario: User navigates to Confirm carrier address page, verify its correctly translated and enters valid postcode
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Carrier address" link
    Then the "Whats Carrier address" page is displayed
    And I verify whats Carrier address page is correctly translated
    And I enter valid Carrier postcode
    And I click search postcode button
    Then the "Select Carrier address" page is displayed
    And I select first Carrier address
    And I click the button Save and continue
    Then the "Confirm Carrier address" page is displayed
    And I should see confirm Carrier address page translated
    And I should see selected carried address displayed correctly

  Scenario: User enters postcode and building number and lands on Address confirmation page
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Carrier address" link
    Then the "Whats Carrier address" page is displayed
    And I enter valid Carrier postcode and building number
    And I click search postcode button
    Then the "Confirm Carrier address" page is displayed
    And I should see the address matching the postcode and building number
    Then I click save and return button
    Then I should see UKWM waste reference on task list page
    And the UKWM task "Carrier address" should be "Completed"

  Scenario: User navigates to Select an address page and click save and continue
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Carrier address" link
    Then the "Whats Carrier address" page is displayed
    And I verify whats Carrier address page is correctly translated
    And I enter valid Carrier postcode
    And I click search postcode button
    Then the "Select Carrier address" page is displayed
    And I click the button Save and continue
    Then I remain on the Select Carrier address page with an "Select an address" error message displayed

  Scenario: User navigates to Select Carrier address page and click save and return button
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Carrier address" link
    Then the "Whats Carrier address" page is displayed
    And I verify whats Carrier address page is correctly translated
    And I enter valid Carrier postcode
    And I click search postcode button
    Then the "Select Carrier address" page is displayed
    And I select second Carrier address
    And I click save and return button
    Then I should see UKWM waste reference on task list page
    And the UKWM task "Carrier address" should be "In progress"

    Scenario: User navigate to edit Carrier address page when user click change address from confirmation page
      Given I navigate to waste tracking accounts page
      When I navigate to the UKM task list page with reference
      And I click the "Carrier address" link
      Then the "Whats Carrier address" page is displayed
      And I verify whats Carrier address page is correctly translated
      And I enter valid Carrier postcode
      And I click search postcode button
      Then the "Select Carrier address" page is displayed
      And I select second Carrier address
      When I click the "Search again" link
      Then the "Whats Carrier address" page is displayed

  Scenario: User navigate to confirm Carrier address page and click Use a different address link
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Carrier address" link
    Then the "Whats Carrier address" page is displayed
    And I verify whats Carrier address page is correctly translated
    And I enter valid Carrier postcode
    And I click search postcode button
    Then the "Select Carrier address" page is displayed
    When I select first Carrier address
    And I click the button Save and continue
    Then the "Confirm Carrier address" page is displayed
    When I click the "Use a different address" link
    Then the "Whats Carrier address" page is displayed

  Scenario: User navigate to confirm Carrier address page and click search again link
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Carrier address" link
    Then the "Whats Carrier address" page is displayed
    And I verify whats Carrier address page is correctly translated
    And I enter valid Carrier postcode
    And I click search postcode button
    Then the "Select Carrier address" page is displayed
    When I select first Carrier address
    And I click the button Save and continue
    Then the "Confirm Carrier address" page is displayed
    When I click the "Search again" link
    Then the "Whats Carrier address" page is displayed

