
Feature: Manage templates page
  I NEED to be able to manage my templates
  SO THAT I can amend the templates relevant and updated for my waste submissions

  @ignore
  Scenario: User navigates to Manage templates page and verifies there are no records
    Given I login to waste tracking portal
    And I click the "Manage your Annex VII record templates" link
    Then Manage your templates page is displayed with no records

  @translation
  Scenario: User creates template from Manage Templates page and verifies that order of the records is correct
    Given I login to waste tracking portal
    And I click the "Manage your Annex VII record templates" link
    Then the "Manage templates" page is displayed
    When I click the "Create a new Annex VII record template" link
    Then the "Create new record template" page is displayed
    And I verify that create new record template page is correctly translated
    Then I complete Create record template page
    And I click Manage templates link
    Then the "Manage templates" page is displayed
    And I verify that manage templates page is correctly translated
    And I verify that newly created template is on top of the table

  Scenario: User cancel template creation and verify template is not present on the manage templates page
    Given I login to waste tracking portal
    And I click the "Create a new Annex VII record template" link
    Then the "Create new record template" page is displayed
    And I click Create template button
    Then I remain on the Create new record template page with an "Enter a name for the template" error message displayed
    And I fill out the name and description fields
    And I click the cancel button
    And I click the "Manage your Annex VII record templates" link
    Then I verify that record is not created

  Scenario: User tries to create template with name that already exist
    Given I login to waste tracking portal
    And I click the "Create a new Annex VII record template" link
    Then the "Create new record template" page is displayed
    And I complete Create record template page
    Then the "Template task list" page is displayed
    And I verify template task page is correctly translated
    And I verify Success banner with template name is displayed
    And I click Manage templates link
    Then the "Manage templates" page is displayed
    Then I click the "Create a new Annex VII record template" link
    And I create a template with the same name as the previous one
    Then I remain on the Create new record template page with an "A template with this name already exists" error message displayed

  Scenario: User updates template name and verifies correct success message is displayed
    Given I login to waste tracking portal
    And I click the "Create a new Annex VII record template" link
    Then the "Create new record template" page is displayed
    And I complete Create record template page
    Then the "Template task list" page is displayed
    And I click the "Name and description" link
    Then the "Update template name" page is displayed
    And I complete the update template page
    Then the "Template task list" page is displayed
    And I verify update success banner is displayed with updated name

  Scenario: User verifies that the old name and description are pre-populated and cancel the update
    Given I login to waste tracking portal
    And I click the "Create a new Annex VII record template" link
    Then the "Create new record template" page is displayed
    And I complete Create record template page
    Then the "Template task list" page is displayed
    And I click the "Name and description" link
    Then the "Update template name" page is displayed
    And I verify that previously entered template details are pre-populated
    And I click the cancel button
    Then the "Template task list" page is displayed

  @translation
  Scenario: User creates a template and makes a copy of it
    Given I login to waste tracking portal
    And I click the "Create a new Annex VII record template" link
    Then the "Create new record template" page is displayed
    And I complete Create record template page
    Then the "Template task list" page is displayed
    And I verify Success banner with template name is displayed
    And I click Manage templates link
    Then the "Manage templates" page is displayed
    And I click Make a copy link on the first template from the table
    Then the "Name of the new template" page is displayed
    And I verify name of the new template page is correctly translated
    And I complete the name of new template page
    Then the "Template task list" page is displayed
    And I verify copy success banner is correctly displayed
    And I click Manage templates link
    Then I verify that copy of the template is on top of the table

  Scenario: User select No option on the delete template page
    Given I login to waste tracking portal
    And I click the "Create a new Annex VII record template" link
    Then the "Create new record template" page is displayed
    And I complete Create record template page
    Then the "Template task list" page is displayed
    And I verify Success banner with template name is displayed
    And I click Manage templates link
    Then the "Manage templates" page is displayed
    And I click delete link for the first template from the table
    Then the "Delete template" page is displayed
    And I choose "No" radio button
    And I click confirm and continue button
    Then the "Manage templates" page is displayed
    And I verify that template is not removed from the table

  Scenario: User select Yes option on the delete template page
    Given I login to waste tracking portal
    And I click the "Create a new Annex VII record template" link
    Then the "Create new record template" page is displayed
    And I complete Create record template page
    Then the "Template task list" page is displayed
    And I verify Success banner with template name is displayed
    And I click Manage templates link
    Then the "Manage templates" page is displayed
    And I click delete link for the first template from the table
    Then the "Delete template" page is displayed
    And I click confirm and continue button
    Then I remain on the Delete template page with an "Select yes if you want to remove this record template" error message displayed
    And I choose "Yes" radio button
    And I click confirm and continue button
    Then the "Manage templates" page is displayed
    And I verify success deletion banner is displayed
    And I verify template record is not present on the table

  Scenario: User hits back button on Template task page after deleting a template
    Given I login to waste tracking portal
    And I click the "Create a new Annex VII record template" link
    Then the "Create new record template" page is displayed
    And I complete Create record template page
    Then the "Template task list" page is displayed
    And I click delete link from task list page
    Then the "Delete template" page is displayed
    And I choose "Yes" radio button
    And I click confirm and continue button
    Then the "Manage templates" page is displayed
    And I click browser back button
    Then Shutter page 404 is displayed

  Scenario: Error validation for invalid characters in Template name
    Given I login to waste tracking portal
    And I click the "Create a new Annex VII record template" link
    Then the "Create new record template" page is displayed
    And I enter template name containing invalid characters
    Then I remain on the Create new record template page with an "The template name must only include letters a to z, numbers, spaces, hyphens, brackets, apostrophes and back slashes" error message displayed

  Scenario: User create template, modify Waste code and description section and verify all entered data is pre-populated
    Given I login to waste tracking portal
    And I click the "Create a new Annex VII record template" link
    Then the "Create new record template" page is displayed
    And I complete Create record template page
    Then the "Template task list" page is displayed
    And I click the "Waste codes and description" link
    Then the "What is the waste code" page is displayed
    And I complete the Waste code and description task
    Then the "Template task list" page is displayed
    And I click the "Waste codes and description" link
    Then I verify previously selected waste code is pre-selected
    And I wait for a second
    Then I should see ewc code description on EWC list page
    And I click the button Save and continue
    Then I should see national code pre-populated
    And I click the button Save and continue
    Then I should see waste description pre-populated
    And I click the button Save and continue
    Then the task "Waste codes and description" should be "COMPLETED"

  Scenario: User create template, modify Importer and Exporter section and verify all entered data is pre-populated
    Given I login to waste tracking portal
    And I click the "Create a new Annex VII record template" link
    Then the "Create new record template" page is displayed
    And I complete Create record template page
    Then the "Template task list" page is displayed
    And I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    Then I click the "Exporter details" link
    And I click the button Save and continue
    And I should see Exporter Organisation name pre-populated
    And I should see Exporter Full name name pre-populated
    And I should see Exporter Email address pre-populated
    And I should see Exporter Phone number pre-populated
    And I click the button Save and continue
    Then the "Who is the importer" page is displayed
    And I verify that previously entered details are pre-populated
    Then I click the button Save and continue
    And I verify that previously entered details are pre-populated on the Importer contact details page
    And I click the button Save and continue
    Then the "Template task list" page is displayed
    And I verify update success banner is displayed
    And the task "Exporter details" should be "COMPLETED"
    And the task "Importer details" should be "COMPLETED"

    #need to be checked, banner does not appear when test running. Manually its working
  Scenario: User create template, modify Journey of a waste section and verify all entered data is pre-populated
    Given I login to waste tracking portal
    And I click the "Create a new Annex VII record template" link
    Then the "Create new record template" page is displayed
    And I complete Create record template page
    Then the "Template task list" page is displayed
    And I click the "Waste carriers" link
    And I complete the Journey of a waste section for templates
    Then the "Template task list" page is displayed
    And I verify update success banner is displayed
    And the task "Waste carriers" should be "IN PROGRESS"
    And the task "Waste collection details" should be "COMPLETED"
    And the task "Location waste leaves the UK" should be "COMPLETED"
    And the task "Countries waste will travel through" should be "COMPLETED"

  Scenario: User create template, modify Treatment of waste section for small waste and verify all entered data is pre-populated
    Given I login to waste tracking portal
    And I click the "Create a new Annex VII record template" link
    Then the "Create new record template" page is displayed
    And I complete Create record template page
    Then the "Template task list" page is displayed
    And I click the "Waste codes and description" link
    Then the "What is the waste code" page is displayed
    And I complete the Waste code and description task with small waste
    Then I click the "Laboratory details" link
    And I complete laboratory address details
    And I complete laboratory contact details
    And I complete disposal code page
    Then the "Template task list" page is displayed
    And I verify update success banner is displayed
    And the task "Laboratory details" should be "COMPLETED"
    And I click the "Laboratory details" link
    Then I should see previously entered Laboratory address details pre-populated
    And I click the button Save and continue
    Then I should see previously entered laboratory contact details pre-populated
    And I click the button Save and continue
    Then I should see disposal code details pre-populated

  Scenario: User create template, modify Treatment of waste section for bulk waste and verify all entered data is pre-populated
    Given I login to waste tracking portal
    And I click the "Create a new Annex VII record template" link
    Then the "Create new record template" page is displayed
    And I complete Create record template page
    Then the "Template task list" page is displayed
    And I click the "Waste codes and description" link
    Then the "What is the waste code" page is displayed
    And I complete the Waste code and description task
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    Then the "Template task list" page is displayed
    And I verify update success banner is displayed
    And the task "Recovery facility details" should be "IN PROGRESS"
    And I click the "Recovery facility" link

  Scenario: User cancel template update and verify task status is not changed
    Given I login to waste tracking portal
    And I click the "Create a new Annex VII record template" link
    Then the "Create new record template" page is displayed
    And I complete Create record template page
    Then the "Template task list" page is displayed
    And I click the "Waste codes and description" link
    Then the "What is the waste code" page is displayed
    And I click Cancel and return to template button
    Then the task "Waste codes and description" should be "NOT STARTED"



