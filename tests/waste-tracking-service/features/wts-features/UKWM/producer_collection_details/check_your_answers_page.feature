@UKMV
Feature: AS A Waste controller
  I NEED to be able to check my answers
  SO THAT I can verify that all the details entered correct

  Scenario: User completes Waste producer and collection details section and verify information displayed on check your answers page
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Producer organisation address" link
    And I complete Waste producer and collection details subsection
    Then the "Sic code" page is displayed
    And I select a SIC code
    And I click the button Save and continue
    And I choose "No" radio button
    And I click the button Save and continue
    Then the "Do You Want To Use Producer Address" page is displayed
    And I choose "Yes, I want to use this address for the waste collection" radio button
    And I click the button Save and continue
    Then the "Confirm Waste Collection Address" page is displayed
    And I click the button Use this address and Continue
    Then the "Source of the waste" page is displayed
    And I choose "Commercial waste" radio button
    And I click the button Save and continue
    Then the "Check Your Answers" page is displayed
    And I should see Producer address correctly displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then the UKWM task "Producer organisation address" should be "Completed"
    Then the UKWM task "Producer organisation contact details" should be "Completed"
    Then the UKWM task "Producer SIC code" should be "Completed"
    Then the UKWM task "Waste collection details" should be "Completed"
    Then the UKWM task "Source of the waste" should be "Completed"
    Then the UKWM task "Check your producer and waste collection answers" should be "Completed"

