@UKMV @enter_Receiver_address
Feature: AS A Waste controller
  I NEED to be able to confirm the Receiver's address
  SO THAT I can ensure the correct address is being used for the Receiver

  Scenario: User navigates to Confirm Receiver address page, verify its correctly translated and enters valid postcode
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Receiver address" link
    Then the "Whats Receiver address" page is displayed
    And I verify whats Receiver address page is correctly translated
    And I enter valid Receiver postcode
    And I click search postcode button
    Then the "Select Receiver address" page is displayed
    And I select first Receiver address
    And I click the button Save and continue
    Then the "Confirm Receiver address" page is displayed
    And I should see confirm Receiver address page translated
    And I should see selected receiver address displayed correctly

  Scenario: User enters postcode and building number and lands on Address confirmation page
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Receiver address" link
    Then the "Whats Receiver address" page is displayed
    And I enter valid Receiver postcode and building number
    And I click search postcode button
    Then the "Confirm Receiver address" page is displayed
    And I should see the address matching the postcode and building number
    Then I click save and return button
    Then I should see UKWM waste reference on task list page
    And the UKWM task "Receiver address" should be "Completed"

  Scenario: User navigates to Select an address page and click save and continue
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Receiver address" link
    Then the "Whats Receiver address" page is displayed
    And I verify whats Receiver address page is correctly translated
    And I enter valid Receiver postcode
    And I click search postcode button
    Then the "Select Receiver address" page is displayed
    And I click the button Save and continue
    Then I remain on the Select Receiver address page with an "Select an address" error message displayed

  Scenario: User navigates to Select Receiver address page and click save and return button
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Receiver address" link
    Then the "Whats Receiver address" page is displayed
    And I verify whats Receiver address page is correctly translated
    And I enter valid Receiver postcode
    And I click search postcode button
    Then the "Select Receiver address" page is displayed
    And I select second Receiver address
    And I click save and return button
    Then I should see UKWM waste reference on task list page
    And the UKWM task "Receiver address" should be "In progress"

  Scenario: User navigate to edit Receiver address page when user click change address from confirmation page
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Receiver address" link
    Then the "Whats Receiver address" page is displayed
    And I verify whats Receiver address page is correctly translated
    And I enter valid Receiver postcode
    And I click search postcode button
    Then the "Select Receiver address" page is displayed
    And I select second Receiver address
    When I click the "Search again" link
    Then the "Whats Receiver address" page is displayed

  Scenario: User navigate to confirm Receiver address page and click Use a different address link
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Receiver address" link
    Then the "Whats Receiver address" page is displayed
    And I verify whats Receiver address page is correctly translated
    And I enter valid Receiver postcode
    And I click search postcode button
    Then the "Select Receiver address" page is displayed
    When I select first Receiver address
    And I click the button Save and continue
    Then the "Confirm Receiver address" page is displayed
    When I click the "Use a different address" link
    Then the "Whats Receiver address" page is displayed

  Scenario: User navigate to confirm Receiver address page and click search again link
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Receiver address" link
    Then the "Whats Receiver address" page is displayed
    And I verify whats Receiver address page is correctly translated
    And I enter valid Receiver postcode
    And I click search postcode button
    Then the "Select Receiver address" page is displayed
    When I select first Receiver address
    And I click the button Save and continue
    Then the "Confirm Receiver address" page is displayed
    When I click the "Search again" link
    Then the "Whats Receiver address" page is displayed

