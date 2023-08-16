Feature:AS A Waste practitioner
  I NEED to be able to see all submitted Annex VII document
  SO THAT I can check any required details

  Scenario: Submit an Annex VII with Actual data
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
    And I click confirm and submit button
    And Export submitted page displayed
    And I click Return to export waste from UK button
    Then the "Export waste from uk" page is displayed
    And I click the "View all submitted Annex VII records" link
    Then the "submitted records" page is displayed
    And I should see submitted records page is correctly translated
    And I should see correct collection date and waste code and transaction reference
    When I click the first view link
    #text is removed for now
#    Then I should see view submitted export page correctly translated
    And I can view submitted export transaction number
    And I should see export reference correctly displayed
    And I should see export About the waste section correctly displayed
    And I should see export Exporter and Importer details correctly displayed
    And I should see export Journey of waste correctly displayed
    And I should see export Treatment of waste correctly displayed
    When I click the "Return to all Annex VII submissions" link
    Then the "submitted records" page is displayed
