Feature: AS A waste producer/broker
  I NEED to be able to add interim site details
  SO THAT the waste can be moved to a temporary site before it recovered

  @translation
  Scenario: Complete Interim site contact details page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Interim site address" page is displayed
    And I should see Interim address page correctly translated
    And I complete the Interim site address page
    And I click the button Save and continue
    Then the "Interim site contact details" page is displayed
    And I should see Interim site contact page correctly translated
    And I complete Interim site contact details page
    And I click the button Save and continue
    Then  the "Interim site recovery code" page is displayed

  Scenario: Complete Interim journey and verify details are saved into the backend
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Interim site address" page is displayed
    And I complete the Interim site address page
    And I click the button Save and continue
    Then the "Interim site contact details" page is displayed
    And I complete Interim site contact details page
    And I click the button Save and continue
    Then  the "Interim site recovery code" page is displayed
    And I choose "R12: Exchange of wastes for submission to any of the operations numbered R01 to R11" radio button
    And I click the button Save and continue
    Then the "Recovery facility address" page is displayed
    And I complete recovery facility address page
    And I click the Save and return to draft
    Then I click the "Recovery facility" link
    And I should see interim site address details pre-populated
    And I click the button Save and continue
    Then I should see interim site contact details pre-populated
    And I click the button Save and continue
    Then I should see previously selected interim recovery code

  Scenario: Complete interim site address page and click save and return to draft
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Interim site address" page is displayed
    And I complete the Interim site address page
    And I click the Save and return to draft
    Then the task "Recovery facility" should be "IN PROGRESS"

  Scenario: User click browser back button on Interim recovery code page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Interim site address" page is displayed
    And I should see Interim address page correctly translated
    And I complete the Interim site address page
    And I click the button Save and continue
    Then the "Interim site contact details" page is displayed
    And I complete Interim site contact details page
    And I click the button Save and continue
    Then  the "Interim site recovery code" page is displayed
    And I click "Back" link should display "Interim site contact details" page
    And I should see interim site contact details pre-populated

  Scenario: User click browser back button on Interim contact details page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Interim site address" page is displayed
    And I should see Interim address page correctly translated
    And I complete the Interim site address page
    And I click the button Save and continue
    Then the "Interim site contact details" page is displayed
    And I click "Back" link should display "Interim site address" page
    Then I should see interim site address details pre-populated

  Scenario: User click browser back button on Interim address page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Interim site address" page is displayed
    And I click "Back" link should display "Submit an export" page
    Then the task "Recovery facility" should be "IN PROGRESS"

  Scenario: Complete recovery facility section and verify its status is Completed
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Interim site address" page is displayed
    And I complete the Interim site address page
    And I click the button Save and continue
    Then the "Interim site contact details" page is displayed
    And I complete Interim site contact details page
    And I click the button Save and continue
    Then  the "Interim site recovery code" page is displayed
    And I choose "R12: Exchange of wastes for submission to any of the operations numbered R01 to R11" radio button
    And I click the button Save and continue
    Then the "Recovery facility address" page is displayed
    When I complete recovery facility address page
    And I click the button Save and continue
    Then the "Recovery facility contact details" page is displayed
    When I complete recovery facility contact details
    And I click the button Save and continue
    Then the "Recovery code" page is displayed
    When I select first recovery code from the recovery facility
    When I click the button Save and continue
    And I should see first recovery facility details
    When I choose "No" radio button
    And I click the button Save and continue
    Then the "Submit an export" page is displayed
    And the task "Recovery facility" should be "COMPLETED"

  Scenario: Error validation on Interim address page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Interim site address" page is displayed
    And I click the button Save and continue
    Then I remain on the Interim site address page with an "Enter the interim site details" error message displayed
    Then I remain on the Interim site address page with an "Enter an address" error message displayed
    Then I remain on the Interim site address page with an "Enter a country" error message displayed

  Scenario: Error validation on Interim address contacts details page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Interim site address" page is displayed
    And I complete the Interim site address page
    And I click the button Save and continue
    Then the "Interim site contact details" page is displayed
    And I click the button Save and continue
    Then I remain on the Interim site contact details page with an "Enter a full name" error message displayed
    Then I remain on the Interim site contact details page with an "Enter an email address" error message displayed
    Then I remain on the Interim site contact details page with an "Enter a phone number" error message displayed


  Scenario: Error validation on Interim recovery code page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Interim site address" page is displayed
    And I complete the Interim site address page
    And I click the button Save and continue
    Then the "Interim site contact details" page is displayed
    And I complete Interim site contact details page
    And I click the button Save and continue
    Then  the "Interim site recovery code" page is displayed
    And I click the button Save and continue
    Then I remain on the Interim site recovery code page with an "Enter a recovery code" error message displayed
