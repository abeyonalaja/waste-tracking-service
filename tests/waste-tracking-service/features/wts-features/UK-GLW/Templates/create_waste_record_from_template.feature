
Feature: Create template page
  AS A waste producer/broker
  I NEED to make use of an existing template
  SO THAT I can save time when submitting an Annex VII record

  @translation
  Scenario: User creates template and verify correct success message is displayed
    Given I login to waste tracking portal
    And I click the "Create a new Annex VII record template" link
    Then the "Create new record template" page is displayed
    And I complete Create record template page
    Then the "Template task list" page is displayed
    And I verify template task page is correctly translated
    And I verify Success banner with template name is displayed
    And I click Manage templates link
    Then the "Manage templates" page is displayed
    Then I verify that newly created template is on top of the table

  Scenario: User creates template and verify task statuses
    Given I login to waste tracking portal
    And I click the "Create a new Annex VII record template" link
    Then the "Create new record template" page is displayed
    And I complete Create record template page
    Then the "Template task list" page is displayed
    And I verify Success banner with template name is displayed
    And the task "Name and description" should be "COMPLETED"
    And the task "Waste codes and description" should be "NOT STARTED"
    And the task "Exporter details" should be "NOT STARTED"
    And the task "Importer details" should be "NOT STARTED"
    And the task "Waste carriers" should be "NOT STARTED"
    And the task "Waste collection details" should be "NOT STARTED"
    And the task "Location waste leaves the UK" should be "NOT STARTED"
    And the task "Countries waste will travel through" should be "NOT STARTED"
    And the task "Recovery facility or laboratory" should be "CANNOT START YET"

  @translation
  Scenario: User create waste record from a template and verify it present on the submitted page
    Given I login to waste tracking portal
    And I click the "Create a new Annex VII record template" link
    Then the "Create new record template" page is displayed
    And I complete Create record template page
    Then the "Template task list" page is displayed
    And I click Use this template to create record link
    Then the "Unique reference" page is displayed
    And I verify Unique reference page is correctly translated
    And I enter valid reference
    Then the "task list" page is displayed
    And I verify important information banner is displayed
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then the task "Quantity of waste" should be "COMPLETED"
    And the task "Waste codes and description" should be "COMPLETED"
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    Then the task "Exporter details" should be "COMPLETED"
    Then the task "Importer details" should be "COMPLETED"
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    Then the task "Recovery facility details" should be "COMPLETED"
    And I click the "Check your record" link
    Then the "check your record" page is displayed
    And I click Confirm all answers button
    Then the "sign declaration" page is displayed
    And I click confirm and submit button
    And Export submitted page displayed
    And I click Return to export waste from UK button
    Then the "Export waste from uk" page is displayed
    And I click the "View all submitted Annex VII records" link
    Then the "submitted records" page is displayed
    And I verify newly created record from template is on top of the table

  Scenario: User create waste record from a template, complete it partially and verify it present on the incomplete page
    Given I login to waste tracking portal
    And I click the "Create a new Annex VII record template" link
    Then the "Create new record template" page is displayed
    And I complete Create record template page
    Then the "Template task list" page is displayed
    And I click Use this template to create record link
    Then the "Unique reference" page is displayed
    And I verify Unique reference page is correctly translated
    And I enter valid reference
    Then the "task list" page is displayed
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    When I click the link Return to this draft later
    When I click the "Manage incomplete Annex VII records" link
    Then I should see draft Annex VII records page
    And I verify newly created record from template is on top of the table

  Scenario: User creates waste record with small waste from a template and verify Sign declaration page information
    Given I login to waste tracking portal
    And I click the "Create a new Annex VII record template" link
    Then the "Create new record template" page is displayed
    And I complete Create record template page
    Then the "Template task list" page is displayed
    And I click Use this template to create record link
    Then the "Unique reference" page is displayed
    And I verify Unique reference page is correctly translated
    And I enter valid reference
    Then the "task list" page is displayed
    And I navigate to Quantity of waste page with "Not applicable" has waste code
    When I click the button Save and continue
    When the quality of small waste page is displayed
    When I choose "Yes, I know the actual amount" radio button
    And I click the button Save and continue
    And I enter valid weight in kilograms
    And I click the button Save and continue
    Then the task "Quantity of waste" should be "COMPLETED"
    And the task "Waste codes and description" should be "COMPLETED"
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    Then the task "Exporter details" should be "COMPLETED"
    Then the task "Importer details" should be "COMPLETED"
    And I click the "Collection date" link
    And I complete the Journey of a waste section with small waste
    Then I click the "Laboratory details" link
    And I complete laboratory address details
    And I complete laboratory contact details
    And I complete disposal code page
    Then the task "Laboratory details" should be "COMPLETED"
    And I click the "Check your record" link
    Then the "check your record" page is displayed
    And I click Confirm all answers button
    Then the "sign declaration" page is displayed
    And I can see page translated correctly for small waste
    And I click confirm and submit button
    And Export submitted page displayed
    And I click Return to export waste from UK button
    Then the "Export waste from uk" page is displayed
    And I click the "View all submitted Annex VII records" link
    Then the "submitted records" page is displayed
    And I verify newly created record from template is on top of the table

  Scenario: User create template at the end of single submission of a waste record
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then the task "Quantity of waste" should be "COMPLETED"
    And the task "Waste codes and description" should be "COMPLETED"
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    Then the task "Exporter details" should be "COMPLETED"
    Then the task "Importer details" should be "COMPLETED"
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    Then the task "Recovery facility details" should be "COMPLETED"
    And I click the "Check your record" link
    Then the "check your record" page is displayed
    And I click Confirm all answers button
    Then the "sign declaration" page is displayed
    And I can see page translated correctly for bulk waste
    And I click confirm and submit button
    Then Export submitted page displayed
    And I click the "Create a new template from this submitted Annex VII record" link
    Then the "Create template from submitted record" page is displayed
    And I verify NOT IN TEMPLATE labels are present
    And I complete create template from a submitted record page
    Then the "Template task list" page is displayed
    And I verify Success banner with template name is displayed
    And the task "Name and description" should be "COMPLETED"
    And the task "Waste codes and description" should be "COMPLETED"
    And the task "Exporter details" should be "COMPLETED"
    And the task "Importer details" should be "COMPLETED"
    And the task "Waste carriers" should be "IN PROGRESS"
    And the task "Waste collection details" should be "COMPLETED"
    And the task "Location waste leaves the UK" should be "COMPLETED"
    And the task "Countries waste will travel through" should be "COMPLETED"
    And the task "Recovery facility details" should be "COMPLETED"
    Then I click Manage templates link
    And I verify that newly created template is on top of the table

  Scenario: Export data should match what is in the template
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then the task "Quantity of waste" should be "COMPLETED"
    And the task "Waste codes and description" should be "COMPLETED"
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    Then the task "Exporter details" should be "COMPLETED"
    Then the task "Importer details" should be "COMPLETED"
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    Then the task "Recovery facility details" should be "COMPLETED"
    And I click the "Check your record" link
    Then the "check your record" page is displayed
    And I click Confirm all answers button
    Then the "sign declaration" page is displayed
    And I can see page translated correctly for bulk waste
    And I click confirm and submit button
    Then Export submitted page displayed
    And I click the "Create a new template from this submitted Annex VII record" link
    Then the "Create template from submitted record" page is displayed
    And I complete create template from a submitted record page
    Then the "Template task list" page is displayed
    And I verify Success banner with template name is displayed
    And the task "Name and description" should be "COMPLETED"
    And the task "Waste codes and description" should be "COMPLETED"
    And the task "Exporter details" should be "COMPLETED"
    And the task "Importer details" should be "COMPLETED"
    And the task "Waste carriers" should be "IN PROGRESS"
    And the task "Waste collection details" should be "COMPLETED"
    And the task "Location waste leaves the UK" should be "COMPLETED"
    And the task "Countries waste will travel through" should be "COMPLETED"
    And the task "Recovery facility details" should be "COMPLETED"
    Then I click Manage templates link
    And I verify that newly created template is on top of the table
    And I click Use template link for the first record in the table
    And I enter valid reference
    Then task list page is displayed
    And the task "Waste codes and description" should be "COMPLETED"
    And the task "Quantity of waste" should be "NOT STARTED"
    And the task "Exporter details" should be "COMPLETED"
    And the task "Importer details" should be "COMPLETED"
    Then the task "Collection date" should be "NOT STARTED"
    And the task "Waste carriers" should be "IN PROGRESS"
    And the task "Waste collection details" should be "COMPLETED"
    And the task "Location waste leaves the UK" should be "COMPLETED"
    And the task "Countries waste will travel through" should be "COMPLETED"
    And the task "Recovery facility details" should be "COMPLETED"
    And the task "Check your report" should be "CANNOT START YET"
    And the task "Sign declaration" should be "CANNOT START YET"
    When I click the "Quantity of waste" link
    And I complete Quantity of waste sub-section
    And the task "Quantity of waste" should be "COMPLETED"
    When I click the "Collection date" link
    And I complete collection date with estimated details
    When I click the "Waste carriers" link
    And I complete waste carrier detail with 1 waste carrier
    And the task "Waste codes and description" should be "COMPLETED"
    And the task "Quantity of waste" should be "COMPLETED"
    And the task "Exporter details" should be "COMPLETED"
    And the task "Importer details" should be "COMPLETED"
    Then the task "Collection date" should be "COMPLETED"
    And the task "Waste carriers" should be "COMPLETED"
    And the task "Waste collection details" should be "COMPLETED"
    And the task "Location waste leaves the UK" should be "COMPLETED"
    And the task "Countries waste will travel through" should be "COMPLETED"
    And the task "Recovery facility details" should be "COMPLETED"
    And the task "Check your report" should be "NOT STARTED"
    And the task "Sign declaration" should be "CANNOT START YET"

  @translation
  Scenario: User use a template to create a single Annex VII record
    Given I login to waste tracking portal
    And I click the "Create a new Annex VII record template" link
    Then the "Create new record template" page is displayed
    And I complete Create record template page
    Then the "Template task list" page is displayed
    And I verify Success banner with template name is displayed
    And I click Return to export waste from UK button
    And I click the "Use a template to create a single Annex VII record" link
    Then the "use template to create record" page is displayed
    And I verify use template to create a record page is correctly translated
    Then I click Use template link for the first record in the table
    Then the "Unique reference" page is displayed
    And I enter valid reference
    Then the "task list" page is displayed
    And I verify important information banner is displayed
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then the task "Quantity of waste" should be "COMPLETED"
    And the task "Waste codes and description" should be "COMPLETED"
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    Then the task "Exporter details" should be "COMPLETED"
    Then the task "Importer details" should be "COMPLETED"
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    Then the task "Recovery facility details" should be "COMPLETED"
    And I click the "Check your record" link
    Then the "check your record" page is displayed
    And I click Confirm all answers button
    Then the "sign declaration" page is displayed
    And I click confirm and submit button
    And Export submitted page displayed
    And I click Return to export waste from UK button
    Then the "Export waste from uk" page is displayed
    And I click the "View all submitted Annex VII records" link
    Then the "submitted records" page is displayed
    And I verify newly created record from template is on top of the table

  Scenario: User navigates to Create a template from a record page using view record link on submitted records page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then the task "Quantity of waste" should be "COMPLETED"
    And the task "Waste codes and description" should be "COMPLETED"
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    Then the task "Exporter details" should be "COMPLETED"
    Then the task "Importer details" should be "COMPLETED"
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    Then the task "Recovery facility details" should be "COMPLETED"
    And I click the "Check your record" link
    Then the "check your record" page is displayed
    And I click Confirm all answers button
    Then the "sign declaration" page is displayed
    And I click confirm and submit button
    Then Export submitted page displayed
    And I click Return to export waste from UK button
    And I click the "View all submitted Annex VII records" link
    Then the "Submitted records" page is displayed
    And I click the first view link
    Then the "Single submitted export" page is displayed
    And I click the "Use this Annex VII record as a template" link
    Then the "Create template from submitted record" page is displayed
    And I complete create template from a submitted record page
    Then the "Template task list" page is displayed
    And I verify template task page is correctly translated
    And I verify Success banner with template name is displayed

  Scenario: User creates template from submitted records page using Use as template
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then the task "Quantity of waste" should be "COMPLETED"
    And the task "Waste codes and description" should be "COMPLETED"
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    Then the task "Exporter details" should be "COMPLETED"
    Then the task "Importer details" should be "COMPLETED"
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    Then the task "Recovery facility details" should be "COMPLETED"
    And I click the "Check your record" link
    Then the "check your record" page is displayed
    And I click Confirm all answers button
    Then the "sign declaration" page is displayed
    And I click confirm and submit button
    Then Export submitted page displayed
    And I click Return to export waste from UK button
    And I click the "View all submitted Annex VII records" link
    Then the "Submitted records" page is displayed
    And I click Use as template link for the first record
    Then the "Create template from submitted record" page is displayed
    And I complete create template from a submitted record page
    Then the "Template task list" page is displayed
    And I verify template task page is correctly translated
    And I verify Success banner with template name is displayed
    And I click Manage templates link
    Then I verify that newly created template is on top of the table

