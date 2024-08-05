Feature: UKM Task List feature
  I NEED to submit waste export
  SO THAT my waste can be processed

  Scenario: Verify UKM task list page default task status
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    Then I should UKWM single journey waste movement page is correctly displayed
    And I should see UKWM waste reference on task list page
    Then I should see waste producer and waste collection status should be "Incomplete"
    And the UKWM task "Producer organisation address" should be "Not started yet"
    And the UKWM task "Producer organisation contact details" should be "Not started yet"
    And the UKWM task "Waste collection details" should be "Not started yet"

