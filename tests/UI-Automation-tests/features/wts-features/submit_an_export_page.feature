Feature: AS A Waste Producer/Broker
  I NEED to submit waste export
  SO THAT my waste can be processed

  Scenario: Reference number should be displayed on Submit an export page
    Given I login to waste tracking portal
    And I navigate to the add reference page
    When I have selected Yes and entered my reference
    Then Submit an export page is displayed
    And the reference should be displayed

  Scenario: Verify Submit an export page default task status
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    Then I have submission incomplete 0 of 4 sections
    And I see these four sections
    And the task "Waste codes and description" should be "NOT STARTED"
    And the task "Quantity of waste" should be "CANNOT START YET"
    And the task "Exporter details" should be "NOT STARTED"
    And the task "Importer details" should be "NOT STARTED"
    And the task "Waste collection details" should be "NOT STARTED"
    And the task "Waste carriers" should be "NOT STARTED"
    And the task "Location waste leaves the UK" should be "NOT STARTED"
    And the task "Countries waste will travel through" should be "NOT STARTED"
    And the task "Recovery facility or laboratory" should be "CANNOT START YET"

  Scenario: Submit an export page Breadcrumb navigation
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And  I click "Your reference" from the breadcrumb
    Then I should see reference number pre-populated
    When I amend the previously entered reference
    And the new reference should be displayed

  Scenario: Return to this draft later should navigate user to Green list waste overview
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the link Return to this draft later
    Then I should green list waste overview page



