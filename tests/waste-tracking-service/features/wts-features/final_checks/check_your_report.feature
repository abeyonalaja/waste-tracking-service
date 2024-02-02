Feature: Check your report page
  AS A Waste Practitioner
  I NEED to have a final section
  SO THAT I can ensure that all my entry details are correctly

  @translation
  Scenario: User should see all the data displayed correctly on check your report page for Bulk waste
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    When I click the "Check your record" link
    Then the "check your record" page is displayed
    #need to check the translation
    And I should see check your report page is correctly translated
    And I should see export reference correctly displayed
    And I should see export About the waste section correctly displayed
    And I should see export Exporter and Importer details correctly displayed
    And I should see export Journey of waste correctly displayed
    And I should see export Treatment of waste correctly displayed

  Scenario: User should see all the data displayed correctly on check your report page for small waste
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task with "Not applicable" has waste code
    And I click the "Quantity of waste" link
    And I complete Quantity of waste with actual small waste
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
    #need to check the translation
    And I should see check your report page is correctly translated for small waste
    And I should see export reference correctly displayed
    And I should see small waste export About the waste section correctly displayed
    And I should see export Exporter and Importer details correctly displayed
    And I should see Small waste export Journey of waste correctly displayed
    And I should see small waste export Treatment of waste correctly displayed

  Scenario: User can update Waste code from bulk to small from check your report page, all the relevant tasks should be reset
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    And I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    When I click the "Check your record" link
    Then the "check your record" page is displayed
    When I click waste code Change link
    Then the "Change waste code" page is displayed
    And I click Continue and change waste code button
    Then the "what is the waste code" page is displayed
    And "Basel Annex IX" is still selected
    When I update Waste codes and description task with Not applicable has waste code
    And I click the Save and return to draft
    Then the task "Quantity of waste" should be "NOT STARTED"
    Then the task "Waste carriers" should be "NOT STARTED"
    Then the task "Laboratory details" should be "NOT STARTED"
    Then the task "Check your report" should be "CANNOT START YET"

  Scenario: User can navigate to check your report page with estimated quantity and collections date
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    When I complete Quantity of waste with estimated bulk waste
    And I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    When the "Importer contact details" page is displayed
    And I complete Importer contact details page
    And I click the button Save and continue
    And I click the "Collection date" link
    When I complete the Journey of a waste section with estimated collection date
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    When I click the "Check your record" link
    Then I should see warning text on check your report page
    Then I should see Estimate Collection date
    And I should see Estimate Quantity of Waste

    #max export for bulk waste
  #defect raised - 304215
  @ignore
  Scenario: User can navigate to check your report page with Max each EWS codes, Waste carriers, Recovery facility and multiple Countries waste will travel
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    When I complete Waste codes and description with Bulk waste and Max EWC codes
    And I click the "Quantity of waste" link
    And I complete Quantity of waste sub-section
    And I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    And I click the "Collection date" link
    And I choose "Yes" radio button
    And I enter valid Actual collection date
    And I click the button Save and continue
    And I complete the "First" waste carrier with "Road"
    And I choose "Yes" radio button
    And I click the button Save and continue
    And I complete the "Second" waste carrier with "Sea"
    And I choose "Yes" radio button
    And I click the button Save and continue
    And I complete the "Third" waste carrier with "Air"
    And I choose "Yes" radio button
    And I click the button Save and continue
    And I complete the "Fourth" waste carrier with "Rail"
    And I choose "Yes" radio button
    And I click the button Save and continue
    And I complete the "Fifth" waste carrier with "Inland waterways"
    And I wait for a second
    And I click the button Save and continue
    And I complete waste carrier location and collection details
    Then I click the "Recovery facility" link
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
    And I complete the "1st" recovery facility
    And I choose "Yes" radio button
    And I click the button Save and continue
    And I complete the "2nd" recovery facility
    And I choose "Yes" radio button
    And I click the button Save and continue
    And I complete the "3rd" recovery facility
    And I choose "Yes" radio button
    And I click the button Save and continue
    And I complete the "4th" recovery facility
    And I choose "Yes" radio button
    And I click the button Save and continue
    And I complete the "5th" recovery facility
    And I click the button Save and continue
    When I click the "Check your record" link
    Then I should see 5 waste carriers on check your export page
    And I should see 5 ewc codes on check your export page
    And I should see interim side details on check your export page
    And I should see 5 recovery facilities on check your export page

  Scenario: User complete export journey without transport details, and verifies Not provided label present on the check your record page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    When I complete Waste codes and description with Bulk waste and Max EWC codes
    And I click the "Quantity of waste" link
    And I complete Quantity of waste sub-section
    And I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    And I click the "Collection date" link
    And I choose "Yes" radio button
    And I enter valid Actual collection date
    And I click the button Save and continue
    And I complete the "First" waste carrier with "Road" without transportation details
    And I choose "No" radio button
    And I click the button Save and continue
    And I complete waste carrier location and collection details
    Then I click the "Recovery facility" link
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
    And I complete the "1st" recovery facility
    And I choose "No" radio button
    And I click the button Save and continue
    When I click the "Check your record" link
    Then I should see 1 waste carriers on check your export page
    Then I should see Not provided label on Check your record page

  Scenario: User can navigate to enter your ref pages from check your report page using change link
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    When I click the "Check your record" link
    Then the "check your record" page is displayed
    #ref change link
    When I click your own reference Change link
    Then I should see reference number pre-populated
    When I click the button Save and continue
    Then task list page is displayed

  Scenario: User can navigate to About the waste page from check your report page using change link
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    When I click the "Check your record" link
    Then the "check your record" page is displayed
   # ewc code change link
    When I click ewc code Change link
    Then I should see ewc code description on EWC list page
    And I choose "No" radio button
    Then I should see selected EWC code on EWC codes page
    When I click the Save and return to draft
    When I click the "Check your record" link
    #national code
    When I click national code Change link
    Then I verify Yes option is selected
    And I should see national code pre-populated
    When I click the Save and return to draft
    And I click the "Check your record" link
    #waste description
    When I click Waste description Change link
    Then I should see previously entered waste description details
    When I click the Save and return to draft
    And I click the "Check your record" link
    When I click Waste quantity Change link
    Then I should see quantity option "Yes, I know the actual amount" is selected

  Scenario: User can navigate to Exporter and Importer from check your report page using change link
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    When I click the "Check your record" link
    Then the "check your record" page is displayed
    #exporter change link
    When I click Exporter address Change link
    Then I verify Enter exporter address manual page is displayed
    When I click the button Save and continue
    Then the "Check exporter address" page is displayed
    When I click the button Save and continue
    When I wait for a second
    Then the "exporter details" page is displayed
    And I click the Save and return to draft
    When I click the "Check your record" link
    And I click Exporter details Change link
    Then the "exporter details" page is displayed
    When I click the Save and return to draft
    When I click the "Check your record" link
    Then the "check your record" page is displayed
    #importer change link
    When I click importer details Change link
    Then the "who is the importer" page is displayed
    When I click the button Save and continue
    Then the "importer contact details" page is displayed
    When I click the Save and return to draft
    When I click the "Check your record" link
    #importer contact change link
    When I click importer contact details Change link
    Then the "importer contact details" page is displayed

  Scenario: User can navigate to Journey of waste from check your report page using change link
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    When I click the "Check your record" link
    Then the "check your record" page is displayed
    When I click on Collection date Change link
    Then I should see Collection date option "Yes" is selected
    When I click the Save and return to draft
    And I click the "Check your record" link
    When I click on Waste carrier Change link
    Then the "Who is the waste carrier" page is displayed
    When I click the Save and return to draft
    And I click the "Check your record" link
    And I wait for a second
    When I click on Waste carrier contact Change link
    And I wait for a second
    Then the "What Are The Waste Carriers Contact Details" page is displayed
    And I wait for a second
    When I click the Save and return to draft
    And I click the "Check your record" link
    When I click the waste carrier transport Change link
    Then the "How Will The Waste Carrier Transport The Waste" page is displayed
    When I click the button Save and continue
    And I click the Save and return to draft
    And I click the "Check your record" link
    And I wait for a second
    When I click mode of transport details Change link
    Then the "Road transport details" page is displayed
    When I click the Save and return to draft
    And I click the "Check your record" link
    When I click waste collection address Change link
    Then the "Manual Address Entry Waste Collection" page is displayed
    When I click the Save and return to draft
    And I click the "Check your record" link
    When I click waste collection contact change link
    Then the "Manual Address Entry Waste Collection" page is displayed
    And I click the button Save and continue
    Then the "check the collection address" page is displayed
    When I click the button Save and continue
    Then the "Contact Details Collection Address" page is displayed
    When I click the Save and return to draft
    And I click the "Check your record" link
    When I click waste leaves location change link
    Then the "Location Waste Leaves The Uk" page is displayed
    When I click the Save and return to draft
    And I click the "Check your record" link
    When I click transit countries change link
    Then the "Waste Transit Countries" page is displayed

  Scenario: User can navigate to Treatment of waste from check your report page using change link
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    When I click the "Check your record" link

  Scenario: Remove only EWC code from check your export page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    When I click the "Check your record" link
    Then the "check your record" page is displayed
   # ewc code change link
    When I click ewc code Change link
    When I click the "Remove" link
    Then I verify confirmation page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then Enter an EWC code is displayed
    
  Scenario: User can navigate to Interim site and recovery facility from check your report page using change link
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    When I click the "Check your record" link
    Then the "check your record" page is displayed
    When I click on Interim site address Change link
    Then I should see interim site address details pre-populated
    When I click the Save and return to draft
    And I click the "Check your record" link
    And I wait for a second
    When I click on Interim site contact Change link
    Then I should see interim site contact details pre-populated
    When I click the Save and return to draft
#    And I click the "Check your record" link
#    And I wait for a second
#    When I click on Interim site recovery code Change link
#    Then I should see previously selected interim recovery code
#    When I click the Save and return to draft
    And I click the "Check your record" link
    And I wait for a second
    When I click on Recovery facility address Change link
    Then I should see previously entered recovery facility details
    When I click the button Save and continue
    When I click the button Save and continue
    When I click the Save and return to draft
    And I click the "Check your record" link
    And I wait for a second
    When I click on Recovery facility contact Change link
    Then I should see previously entered recovery contact details
    When I click the button Save and continue
    When I click the Save and return to draft
    And I click the "Check your record" link
    And I wait for a second
    When I click on Recovery facility code Change link
    Then I should see previously entered recovery code details pre-populated
























