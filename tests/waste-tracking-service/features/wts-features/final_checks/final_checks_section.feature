Feature: AS A Waste Practitioner
  I NEED to have a final section
  SO THAT I can ensure that all my entry details are correctly

  Scenario: Complete all sections from Submit an export page and verify tasks status
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
    Then the task "Check your report" should be "NOT STARTED"
    Then the task "Sign declaration" should be "CANNOT START YET"

  Scenario: Change details on Quantity of waste task under Waste code and description section
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
    Then I click the "Quantity of waste" link
    And I choose "No, I do not know the amount yet" radio button
    And I click the button Save and continue
    Then the task "Quantity of waste" should be "IN PROGRESS"
    Then the task "Check your report" should be "CANNOT START YET"

  Scenario: Change bulk waste to small waste by choosing Not applicable option on Waste codes and description task
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
    Then I click the "Waste codes and description" link
    And the "What is the waste code" page is displayed
    And I choose "Not applicable" radio button
    And I click the Save and return to draft
    Then the task "Quantity of waste" should be "NOT STARTED"
    Then the task "Waste carriers" should be "IN PROGRESS"
    Then the task "Laboratory details" should be "NOT STARTED"
