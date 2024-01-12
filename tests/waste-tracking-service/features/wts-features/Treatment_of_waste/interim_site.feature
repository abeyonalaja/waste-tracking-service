Feature: Interim site page
  I NEED to be able to add interim site details
  SO THAT the waste can be moved to a temporary site before it recovered

  @translation
  Scenario: Complete Interim site contact details page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
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
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then the "Interim site address" page is displayed
    And I complete the Interim site address page
    And I wait for a second
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
    Then the "Confirmation Interim Site" page is displayed
    And I see previously selected option pre-selected
    And I click the button Save and continue
    And I should see interim site address details pre-populated
    And I click the button Save and continue
    Then I should see interim site contact details pre-populated
    And I click the button Save and continue
    Then I should see previously selected interim recovery code

  Scenario: Complete interim site address page and click save and return to draft
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then the "Interim site address" page is displayed
    And I complete the Interim site address page
    And I wait for a second
    And I click the Save and return to draft
    Then the task "Recovery facility details" should be "IN PROGRESS"

  Scenario: User click browser back button on Interim recovery code page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then the "Interim site address" page is displayed
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
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then the "Interim site address" page is displayed
    And I complete the Interim site address page
    And I click the button Save and continue
    Then the "Interim site contact details" page is displayed
    And I click "Back" link should display "Interim site address" page
    Then I should see interim site address details pre-populated

  Scenario: Complete recovery facility section and verify its status is Completed
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then the "Interim site address" page is displayed
    And I complete the Interim site address page
    And I click the button Save and continue
    Then the "Interim site contact details" page is displayed
    And I complete Interim site contact details page
    And I click the button Save and continue
    Then  the "Interim site recovery code" page is displayed
    And I choose "R12: Exchange of wastes for submission to any of the operations numbered R01 to R11" radio button
    And I wait for a second
    And I click the button Save and continue
    Then the "Recovery facility address" page is displayed
    When I complete recovery facility address page
    And I click the button Save and continue
    And I wait for a second
    Then the "Recovery facility contact details" page is displayed
    When I complete recovery facility contact details
    And I click the button Save and continue
    Then the recovery code page is displayed and correctly translated
    When I select first recovery code from the recovery facility
    When I click the button Save and continue
    And I should see 1st recovery facility details
    When I choose "No" radio button
    And I click the button Save and continue
    Then the "task list" page is displayed
    And the task "Recovery facility details" should be "COMPLETED"

  Scenario: Error validation on Interim address page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I wait for a second
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then the "Interim site address" page is displayed
    And I wait for a second
    And I click the button Save and continue
    Then I remain on the Interim site address page with an "Enter the interim site details" error message displayed
    Then I remain on the Interim site address page with an "Enter an address" error message displayed
    Then I remain on the Interim site address page with an "Enter a country" error message displayed

  Scenario: Error validation on Interim address contacts details page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
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
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then the "Interim site address" page is displayed
    And I complete the Interim site address page
    And I click the button Save and continue
    Then the "Interim site contact details" page is displayed
    And I complete Interim site contact details page
    And I click the button Save and continue
    Then  the "Interim site recovery code" page is displayed
    And I click the button Save and continue
    Then I remain on the Interim site recovery code page with an "Enter a recovery code" error message displayed

  @translation  @single
  Scenario: User navigates to interim site confirmation page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I see Confirmation interim site page translated
    And I click description link
    Then I see interim site description translated
    And I click "Back" link should display "task list" page

  Scenario: User select Yes option on interim confirmation page and click save and continue
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then the "Interim site address" page is displayed
    And I complete the Interim site address page
    And I wait for a second
    And I click the Save and return to draft
    Then the "task list" page is displayed
    Then the task "Recovery facility details" should be "IN PROGRESS"

  Scenario: User select No option on interim confirmation page and click save and continue
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "No" radio button
    And I click the button Save and continue
    Then the "Recovery facility address" page is displayed
    And I complete recovery facility address page
    And I click the Save and return to draft
    Then the "task list" page is displayed
    Then the task "Recovery facility details" should be "IN PROGRESS"

  Scenario: User select Back button on recovery facility address page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "No" radio button
    And I click the button Save and continue
    Then the "Recovery facility address" page is displayed
    And I click "Back" link should display "Confirmation Interim Site" page

  Scenario: User select Back button on interim site address page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then the "Interim site address" page is displayed
    And I click "Back" link should display "Confirmation Interim Site" page

  Scenario: User verifying that entered data is saved on the backend
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then the "Interim site address" page is displayed
    And I complete the Interim site address page
    And I click the Save and return to draft
    Then the "task list" page is displayed
    Then the task "Recovery facility details" should be "IN PROGRESS"
    And I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I see previously selected option pre-selected
    And I click the button Save and continue
    Then I should see interim site address details pre-populated

  Scenario: User change selected option on confirmation interim site page from Yes to No
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then the "Interim site address" page is displayed
    And I complete the Interim site address page
    And I click the Save and return to draft
    Then the "task list" page is displayed
    Then the task "Recovery facility details" should be "IN PROGRESS"
    And I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I see previously selected option pre-selected
    And I choose "No" radio button
    And I click the button Save and continue
    Then the "Recovery facility address" page is displayed

  Scenario: Error validation on Confirmation interim site page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I click the button Save and continue
    Then I remain on the Confirmation interim site page with an "Select yes if the waste will go to an interim site" error message displayed
