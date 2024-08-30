@UKMV
Feature: UKM Task List feature
  I NEED to submit waste export
  SO THAT my waste can be processed

  Scenario: Verify UKM task list page default task status
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    Then I should UKWM task link page is correctly displayed
    And I should see UKWM waste reference on task list page
    Then I should see waste producer and waste collection status should be "Incomplete"
    And the UKWM task "Producer organisation address" should be "Not started yet"
    And the UKWM task "Producer organisation contact details" should be "Not started yet"
    And the UKWM task "Producer SIC code" should be "Not started yet"
    And the UKWM task "Waste collection details" should be "Not started yet"
    And the UKWM task "Source of the waste" should be "Not started yet"
    And the UKWM task "Check your producer and waste collection answers" should be "Not started yet"
    Then I should see Waste carrier details status should be "Incomplete"
    And the UKWM task "Carrier address" should be "Not started yet"
    And the UKWM task "Carrier contact details" should be "Not started yet"
    And the UKWM task "Carrier mode of transport" should be "Not started yet"
    And the UKWM task "Check your carrier details answers" should be "Not started yet"
    Then I should see Waste receiver details status should be "Incomplete"
    And the UKWM task "Receiver address" should be "Not started yet"
    And the UKWM task "Receiver contact details" should be "Not started yet"
    And the UKWM task "Receiver permit details" should be "Not started yet"
    And the UKWM task "Check your receiver details answers" should be "Not started yet"



