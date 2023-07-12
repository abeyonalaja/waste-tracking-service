Feature: AS A Waste Practitioner
  I NEED to have a final section
  SO THAT I can ensure that all my entry details are correctly

  Scenario: User should see all the data displayed correctly on check your report page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
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
    When I click the "Check your report" link
    Then the "check your report" page is displayed
    #need to check the translation
    And I should see check your report page is correctly translated
    And I should see export reference correctly displayed
    And I should see export About the waste section correctly displayed
    And I should see export Exporter and Importer details correctly displayed
    And I should see export Journey of waste correctly displayed
    And I should see export Treatment of waste correctly displayed

  Scenario: User can update Waste code from bulk to small from check your report page, all the relevant tasks should be reset
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
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
    When I click the "Check your report" link
    Then the "check your report" page is displayed
    When I click change link for waste code
    Then the "what is the waste code" page is displayed
    And "Basel Annex IX" is still selected
    When I update Waste codes and description task with Not applicable has waste code
    And I click the Save and return to draft
    Then the task "Quantity of waste" should be "NOT STARTED"
    Then the task "Waste carriers" should be "IN PROGRESS"
    Then the task "Laboratory details" should be "NOT STARTED"
    Then the task "Check your report" should be "CANNOT START YET"

