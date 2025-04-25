Feature: Checking templates

  Scenario: Create a template
    Given I send a POST request to create a template
    Then I should see template is successfully created

  Scenario: Can't create a template with same name
    Given I send a POST request to create a template with name "waste tracking template"
    Then I should see template is successfully created
    When I try to create a template with same name
    Then I should see template is cannot be created

  Scenario: Get template from the service
    Given I send a POST request to create a template with name "waste tracking template"
    Then I should see template is successfully created
    When I request the new created template details
    Then I should see template name is correctly displayed

  Scenario: Delete a template from the service
    Given I send a POST request to create a template with name "waste tracking template"
    Then I should see template is successfully created
    When I request to delete the newly created template
    Then I should see template is successfully deleted

  Scenario: Create an template from an existing template
    Given I send a POST request to create a template with name "waste tracking template"
    Then I should see template is successfully created
    When I create an template from an existing template
    Then I should see template is successfully created

  Scenario: Can't create a template from an existing template with same name
    Given I send a POST request to create a template with name "waste tracking template"
    Then I should see template is successfully created
    When I create an template from an existing template with same name
    Then I should see template is cannot be created

  Scenario: Can't create a template without name
    Given I send a POST request to create a template with no name
    Then I should see "400" bad request response

  Scenario: Add small waste description for a template
    Given I send a POST request to create a template
    Then I should see template is successfully created
    When I request to add small waste description for a template
    Then waste description should be successfully added to the template with status "Complete"

  Scenario: Add bulk waste description for a template
    Given I send a POST request to create a template
    Then I should see template is successfully created
    When I request to add bulk waste description for a template
    Then waste description should be successfully added to the template
    Then template request waste description should be completed with status "NotStarted"

  Scenario: Add data for a template
    Given I send a POST request to create a template
    Then I should see template is successfully created
    #waste description
    When I request to add bulk waste description for a template
    Then waste description should be successfully added to the template
    #exporter
    When I request to add exporter details for a template
    Then exporter details should be successfully added to the template
    #importer
    When I request to add importer details for a template
    Then importer details should be successfully added to the template
    #waste carrier
    When I request to add waste carrier for a template
    Then waste carrier details should be successfully added to the template
    #collection details
    When I request to add collection details for a template
    Then collection details should be successfully added to the template
    #exit location
    When I request to add exit location for a template
    Then exit location should be successfully added to the template
     #transit countries
    When I request to add transit countries for a template
    Then transit countries should be successfully added to the template
      #transit countries
    When I request to recovery facility for a template
    Then recovery facility should be successfully added to the template


  Scenario: Creating a template from a existing template
    Given I send a POST request to create a template
    Then I should see template is successfully created
    #waste description
    When I request to add bulk waste description for a template
    Then waste description should be successfully added to the template
    #exporter
    When I request to add exporter details for a template
    Then exporter details should be successfully added to the template
    #importer
    When I request to add importer details for a template
    Then importer details should be successfully added to the template
    #waste carrier
    When I request to add waste carrier for a template
    Then waste carrier details should be successfully added to the template
    #collection details
    When I request to add collection details for a template
    Then collection details should be successfully added to the template
    #exit location
    When I request to add exit location for a template
    Then exit location should be successfully added to the template
    When I create an template from an existing template
    Then I should see template is successfully created
    Then exit location should be successfully added to the template






