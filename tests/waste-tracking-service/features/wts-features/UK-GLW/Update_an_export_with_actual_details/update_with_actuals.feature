
Feature: Submitted with estimates page
  I NEED to be able to amend the submitted Annex 7 form
  SO THAT I can update the form and replace any estimate with actuals

  #can't test it on dev tst
  @ignore
  Scenario: User complete an export with actual and verifies that there are no records in the update with actual section
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
    And I should see export submitted page is correctly translated
    And I click Return to export waste from UK button
    Then the "Export waste from uk" page is displayed
    And I click the "Update an Annex VII record with actual details" link
    Then the "Update with actual" page is displayed
    And I see message that there are no exports with estimates

  @translation
  Scenario: User completes an export with estimate date and verify record is saved on Update with actual section
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
    And I complete the Journey of a waste section with estimated collection date
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
    Then I should see export submitted page with estimates correctly translated
    And I click Return to export waste from UK button
    Then the "Export waste from uk" page is displayed
    And I click the "Update an Annex VII record with actual details" link
    Then the "Update with actual" page is displayed
    And I can see Update with actual page correctly translated
      #check pagination
    Then I should see pagination when exports are more than 15
    Then I verify that newly created record is on top of the table
    And I should see correct date and waste code and transaction reference
    And I click browser back button
    Then the "Export waste from uk" page is displayed

  @translation
  Scenario: User creates an export record, navigates to update annex record page and verify that entered information is correct
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
    And I complete the Journey of a waste section with estimated collection date
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
    Then I should see export submitted page with estimates correctly translated
    And I click Return to export waste from UK button
    Then the "Export waste from uk" page is displayed
    And I click the "Update an Annex VII record with actual details" link
    Then the "Update with actual" page is displayed
    And I click the first update link
    Then the "Update annex record" page is displayed
    And I verify update annex record page is correctly translated
    Then I click show all sections link
    And I verify hide all sections link is now visible
    And I should see export reference correctly displayed
    And I should see export About the waste section correctly displayed
    And I should see export Exporter and Importer details correctly displayed
    And I should see export Journey of waste with estimated collection date correctly displayed
    And I should see export Treatment of waste correctly displayed
    And I click the "Return to all Annex VII records" link
    Then the "Update with actual" page is displayed

  Scenario: User verifies Actual needed label present on the estimated values
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste with estimated bulk waste
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
    Then the task "Recovery facility details" should be "COMPLETED"
    And I click the "Check your record" link
    Then the "check your record" page is displayed
    And I click Confirm all answers button
    Then the "sign declaration" page is displayed
    And I can see page translated correctly for bulk waste
    And I click confirm and submit button
    Then Export submitted page displayed
    And I click Return to export waste from UK button
    Then the "Export waste from uk" page is displayed
    And I click the "Update an Annex VII record with actual details" link
    Then the "Update with actual" page is displayed
    When I click the first update link
    Then the "Update annex record" page is displayed
    And I verify Actual needed labels are present on the page

  Scenario: User verifies that Not provided label is showing under the reference column on Update with actual page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    Then task list page is displayed
    And I navigate to Quantity of waste page
    And I complete Quantity of waste with estimated bulk waste
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
    Then the task "Recovery facility details" should be "COMPLETED"
    And I click the "Check your record" link
    Then the "check your record" page is displayed
    And I click Confirm all answers button
    Then the "sign declaration" page is displayed
    And I can see page translated correctly for bulk waste
    And I click confirm and submit button
    Then Export submitted page displayed
    And I click Return to export waste from UK button
    Then the "Export waste from uk" page is displayed
    And I click the "Update an Annex VII record with actual details" link
    Then the "Update with actual" page is displayed
    And I verify reference section is filled with reference
    And I should see correct date and waste code and transaction reference

  Scenario: User can update estimated quantity in tonnes and collection date then record should move to submitted list
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    Then task list page is displayed
    And I navigate to Quantity of waste page
    When I complete Quantity of waste with estimated bulk waste
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
    Then the task "Recovery facility details" should be "COMPLETED"
    And I click the "Check your record" link
    Then the "check your record" page is displayed
    And I click Confirm all answers button
    Then the "sign declaration" page is displayed
    And I can see page translated correctly for bulk waste
    And I click confirm and submit button
    Then Export submitted page displayed
    And I click Return to export waste from UK button
    Then the "Export waste from uk" page is displayed
    And I click the "Update an Annex VII record with actual details" link
    Then the "Update with actual" page is displayed
    And I verify reference section is filled with reference
    And I should see correct date and waste code and transaction reference
    When I click the first update link
    And I expand About the waste section
    When I click update estimated quantity of waste
    Then the "actual weight" page is displayed
    When I enter valid weight in tonnes
    And I click the update button
    Then I should see success message translated correctly
    And I expand About the waste section
    Then I should see quantity of actual waste updated in tonnes
    Then I click show all sections link
    When I click the "Update" link
    Then the "actual collection date" page is displayed
    And I should see actual collection date correctly translated
    When I enter valid Actual collection date
    And I click the update button
    Then I click show all sections link
    And I should see actual collection date correctly displayed
    When I click "Back" link should display "Update with actual" page
    Then I should not see updated with actual exports on update with actual page
    When I click Export waste from the UK from the breadcrumb
    And I click the "View all submitted Annex VII records" link
    Then the "Submitted records" page is displayed
    And I verify reference section is filled with reference
    And I should see update collection date and waste code and transaction reference

  Scenario: User can update estimated quantity in cubic meters and collection date and confirm the changes, export should be in submitted lists
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    Then task list page is displayed
    And I navigate to Quantity of waste page
    When I complete Quantity of waste with estimated bulk waste
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
    Then the task "Recovery facility details" should be "COMPLETED"
    And I click the "Check your record" link
    Then the "check your record" page is displayed
    And I click Confirm all answers button
    Then the "sign declaration" page is displayed
    And I can see page translated correctly for bulk waste
    And I click confirm and submit button
    Then Export submitted page displayed
    And I click Return to export waste from UK button
    Then the "Export waste from uk" page is displayed
    And I click the "Update an Annex VII record with actual details" link
    Then the "Update with actual" page is displayed
    And I verify reference section is filled with reference
    And I should see correct date and waste code and transaction reference
    When I click the first update link
    And I expand About the waste section
    When I click update estimated quantity of waste
    Then the "actual weight" page is displayed
    When I click the "Update quantity in cubic metres (m3)" link
    Then the "Actual volume" page is displayed
    When I enter valid weight in cubic meters
    And I click the update button
    Then I should see success message translated correctly
    And I expand About the waste section
    Then I should see quantity of actual waste updated in cubic meters
    Then I click show all sections link
    When I click the "Update" link
    Then the "actual collection date" page is displayed
    And I should see actual collection date correctly translated
    When I enter valid Actual collection date
    And I click the update button
    Then I click show all sections link
    And I should see actual collection date correctly displayed
    Then I should see success message translated correctly
    When I click Confirm all answers button
    Then Export update submitted page displayed
    And I should see export update submitted page correctly translated
    And I should see the transaction number remains same
    When I click the "Create a green list waste movement record" link
    And I click the "View all submitted Annex VII records" link
    Then the "submitted records" page is displayed
    And I should see submitted records page is correctly translated
    And I should see correct collection date and waste code and transaction reference

  Scenario: User can update estimated quantity in kilograms after submission
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    Then task list page is displayed
    And I navigate to Quantity of waste page with "Not applicable" has waste code
    When I complete Quantity of waste with estimated small waste
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
    And I complete the Journey of a waste section with estimated small waste
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
    Then Export submitted page displayed
    And I click Return to export waste from UK button
    Then the "Export waste from uk" page is displayed
    And I click the "Update an Annex VII record with actual details" link
    Then the "Update with actual" page is displayed
    And I verify reference section is filled with reference
    And I should see correct date and waste code and transaction reference
    When I click the first update link
    And I expand About the waste section
    When I click update estimated quantity of waste
    Then the "net small weight" page is displayed
    And I should see the transaction number on update estimate page
    And I enter valid weight in kilograms
    And I click the update button
    Then I should see success message translated correctly
    And I expand About the waste section
    Then I should see quantity of actual waste updated in kilograms

  Scenario: Check the back link from estimated collection date and estimated small quantity of waste
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    Then task list page is displayed
    And I navigate to Quantity of waste page with "Not applicable" has waste code
    When I complete Quantity of waste with estimated small waste
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
    And I complete the Journey of a waste section with estimated small waste
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
    Then Export submitted page displayed
    And I click Return to export waste from UK button
    Then the "Export waste from uk" page is displayed
    And I click the "Update an Annex VII record with actual details" link
    Then the "Update with actual" page is displayed
    When I click the first update link
    And I expand About the waste section
    When I click update estimated quantity of waste
    Then the "net small weight" page is displayed
    When I click "Back" link should display "update with actual" page
    Then I click show all sections link
    When I click the update collection date link
    Then the "actual collection date" page is displayed
    When I click "Back" link should display "update with actual" page

  Scenario: Check the back link from estimated collection date and estimated bulk quantity of waste
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    Then task list page is displayed
    And I navigate to Quantity of waste page
    When I complete Quantity of waste with estimated bulk waste
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
    Then the task "Recovery facility details" should be "COMPLETED"
    And I click the "Check your record" link
    Then the "check your record" page is displayed
    And I click Confirm all answers button
    Then the "sign declaration" page is displayed
    And I can see page translated correctly for bulk waste
    And I click confirm and submit button
    Then Export submitted page displayed
    And I click Return to export waste from UK button
    Then the "Export waste from uk" page is displayed
    And I click the "Update an Annex VII record with actual details" link
    Then the "Update with actual" page is displayed
    And I verify reference section is filled with reference
    And I should see correct date and waste code and transaction reference
    When I click the first update link
    And I expand About the waste section
    When I click update estimated quantity of waste
    Then the "actual weight" page is displayed
    When I click "Back" link should display "update with actual" page
    And I expand About the waste section
    When I click update estimated quantity of waste
    Then the "actual weight" page is displayed
    When I click the "Update quantity in cubic metres (m3)" link
    Then the "Actual volume" page is displayed
    When I click "Back" link should display "update with actual" page

  Scenario: User can't Cancel estimated export without selecting any reason
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    Then task list page is displayed
    And I navigate to Quantity of waste page
    When I complete Quantity of waste with estimated bulk waste
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
    Then the task "Recovery facility details" should be "COMPLETED"
    And I click the "Check your record" link
    Then the "check your record" page is displayed
    And I click Confirm all answers button
    Then the "sign declaration" page is displayed
    And I can see page translated correctly for bulk waste
    And I click confirm and submit button
    Then Export submitted page displayed
    And I click Return to export waste from UK button
    Then the "Export waste from uk" page is displayed
    And I click the "Update an Annex VII record with actual details" link
    Then the "Update with actual" page is displayed
    And I verify reference section is filled with reference
    And I should see correct date and waste code and transaction reference
    When I click first cancel button
    Then the "cancel the export" page is displayed
    And I should see cancel the export page correctly translated
    When I click the "Cancel this record" button
    Then I remain on the cancel the export page with an "Select a reason if you want to cancel this document" error message displayed

    #defect - 306758
  @ignore
  Scenario: User can Cancel estimated export with Change of recovery facility or laboratory reason
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    Then task list page is displayed
    And I navigate to Quantity of waste page
    When I complete Quantity of waste with estimated bulk waste
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
    Then the task "Recovery facility details" should be "COMPLETED"
    And I click the "Check your record" link
    Then the "check your record" page is displayed
    And I click Confirm all answers button
    Then the "sign declaration" page is displayed
    And I can see page translated correctly for bulk waste
    And I click confirm and submit button
    Then Export submitted page displayed
    And I click Return to export waste from UK button
    Then the "Export waste from uk" page is displayed
    And I click the "Update an Annex VII record with actual details" link
    Then the "Update with actual" page is displayed
    And I verify reference section is filled with reference
    And I should see correct date and waste code and transaction reference
    When I click first cancel button
    Then the "cancel the export" page is displayed
    And I should see cancel the export page correctly translated
    When I choose "Change of recovery facility or laboratory" radio button
    When I click the "Cancel this record" button
    Then the "Update with actual" page is displayed
    And I should see Success cancelled message
    And I should not see cancelled export on update with actual page

    #defect - 306758
  @ignore
  Scenario: User can Cancel estimated export with No longer exporting this waste reason
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    Then task list page is displayed
    And I navigate to Quantity of waste page
    When I complete Quantity of waste with estimated bulk waste
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
    Then the task "Recovery facility details" should be "COMPLETED"
    And I click the "Check your record" link
    Then the "check your record" page is displayed
    And I click Confirm all answers button
    Then the "sign declaration" page is displayed
    And I can see page translated correctly for bulk waste
    And I click confirm and submit button
    Then Export submitted page displayed
    And I click Return to export waste from UK button
    Then the "Export waste from uk" page is displayed
    And I click the "Update an Annex VII record with actual details" link
    Then the "Update with actual" page is displayed
    And I verify reference section is filled with reference
    And I should see correct date and waste code and transaction reference
    When I click first cancel button
    Then the "cancel the export" page is displayed
    And I should see cancel the export page correctly translated
    When I choose "No longer exporting this waste" radio button
    When I click the "Cancel this record" button
    Then the "Update with actual" page is displayed
    And I should see Success cancelled message
    And I should not see cancelled export on update with actual page

    #defect - 306758
  @ignore
  Scenario: User can Cancel estimated export with other reason
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    Then task list page is displayed
    And I navigate to Quantity of waste page
    When I complete Quantity of waste with estimated bulk waste
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
    Then the task "Recovery facility details" should be "COMPLETED"
    And I click the "Check your record" link
    Then the "check your record" page is displayed
    And I click Confirm all answers button
    Then the "sign declaration" page is displayed
    And I can see page translated correctly for bulk waste
    And I click confirm and submit button
    Then Export submitted page displayed
    And I click Return to export waste from UK button
    Then the "Export waste from uk" page is displayed
    And I click the "Update an Annex VII record with actual details" link
    Then the "Update with actual" page is displayed
    And I verify reference section is filled with reference
    And I should see correct date and waste code and transaction reference
    And I wait for a second
    When I click first cancel button
    And I should see cancel the export page correctly translated
    When I click the "Return to Annex VII records" link
    Then the "Update with actual" page is displayed
    And I should see cancelled export on update with actual page
    When I click first cancel button
    And I wait for a second
    Then the "cancel the export" page is displayed
    And I should see cancel the export page correctly translated
    When I choose "Other" radio button
    When I click the "Cancel this record" button
    Then I remain on the cancel the export page with an "Enter a reason" error message displayed
    When I enter a reason more than 100 character
    When I click the "Cancel this record" button
    Then I remain on the cancel the export page with an "Reason must be 100 characters or less" error message displayed
    When I enter a valid cancellation reason
    When I click the "Cancel this record" button
    Then the "Update with actual" page is displayed
    And I should see Success cancelled message
    And I should not see cancelled export on update with actual page







