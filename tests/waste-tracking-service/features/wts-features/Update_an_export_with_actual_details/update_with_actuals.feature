Feature: AS A waste practitioner
  I NEED to be able to amend the submitted Annex 7 form
  SO THAT I can update the form and replace any estimate with actuals

  @ignore
  Scenario: User complete an export with actual and verifies that there are no records in the update with actual section
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
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
    Then the task "Recovery facility" should be "COMPLETED"
    And I click the "Check your report" link
    Then the "check your report" page is displayed
    And I click Confirm all answers button
    Then the "sign declaration" page is displayed
    And I can see page translated correctly for bulk waste
    And I click confirm and submit button
    Then Export submitted page displayed
    And I should see export submitted page is correctly translated
    And I click Return to export waste from UK button
    Then the "Export waste from uk" page is displayed
    And I click the "Update an Annex VII record with actual details" link
    Then the "Update with actual" page is displayed
    And I see message that there are no exports with estimates


  @translation
  Scenario: User completes an export with estimate date and verify record is saved on Update with actual section
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
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
    And I complete the Journey of a waste section with estimated collection date
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    Then the task "Recovery facility" should be "COMPLETED"
    And I click the "Check your report" link
    Then the "check your report" page is displayed
    And I click Confirm all answers button
    Then the "sign declaration" page is displayed
    And I can see page translated correctly for bulk waste
    And I click confirm and submit button
    Then Export submitted page displayed
    Then I should see export submitted page with estimates correctly translated
    And I click Return to export waste from UK button
    Then the "Export waste from uk" page is displayed
    And I click the "Update an Annex VII record with actual details" link
    Then the "Update with actual" page is displayed
    And I can see Update with actual page correctly translated
    Then I verify that newly created record is on top of the table
    And I should see correct date and waste code and transaction reference
    And I click browser back button
    Then the "Export waste from uk" page is displayed

  Scenario: User verifies that Not provided label is showing under the reference column on Update with actual page
    Given I login to waste tracking portal
    And I navigate to the submit an export with no reference
    Then Submit an export page is displayed
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
    And I complete the Journey of a waste section with estimated collection date
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    Then the task "Recovery facility" should be "COMPLETED"
    And I click the "Check your report" link
    Then the "check your report" page is displayed
    And I click Confirm all answers button
    Then the "sign declaration" page is displayed
    And I can see page translated correctly for bulk waste
    And I click confirm and submit button
    Then Export submitted page displayed
    And I click Return to export waste from UK button
    Then the "Export waste from uk" page is displayed
    And I click the "Update an Annex VII record with actual details" link
    Then the "Update with actual" page is displayed
    And I verify reference section is filled with 'Not provided'
    And I should see correct date and waste code and transaction reference

