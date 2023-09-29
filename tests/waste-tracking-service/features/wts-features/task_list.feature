Feature: AS A Waste Producer/Broker
  I NEED to submit waste export
  SO THAT my waste can be processed

  Scenario: Reference number should be displayed on task list page page
    Given I login to waste tracking portal
    And I navigate to the add reference page
    When I have entered my reference
    Then task list page is displayed
    And the reference should be displayed

  Scenario: Verify task list page default task status
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    Then I have submission incomplete 0 of 5 sections
    And I see these five sections
    And the task "Waste codes and description" should be "NOT STARTED"
    And the task "Quantity of waste" should be "CANNOT START YET"
    And the task "Exporter details" should be "NOT STARTED"
    And the task "Importer details" should be "NOT STARTED"
    Then the task "Collection date" should be "NOT STARTED"
    And the task "Waste collection details" should be "NOT STARTED"
    And the task "Waste carriers" should be "NOT STARTED"
    And the task "Location waste leaves the UK" should be "NOT STARTED"
    And the task "Countries waste will travel through" should be "NOT STARTED"
    And the task "Recovery facility or laboratory" should be "CANNOT START YET"
    And the task "Check your report" should be "CANNOT START YET"
    And the task "Sign declaration" should be "CANNOT START YET"

  Scenario: task list page Breadcrumb navigation
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And  I click "Your reference" from the breadcrumb
    Then I should see reference number pre-populated
    When I amend the previously entered reference
    And the new reference should be displayed

  Scenario: Return to this draft later should navigate user to Green list waste overview
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the link Return to this draft later
    Then Export waste from UK page is displayed



