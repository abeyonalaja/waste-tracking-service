Feature: AS A waste producer
  I NEED to add the exporter’s details
  SO THAT the exporter can be tracker

  Scenario: Display selected address
    Given that I am on the “Exporter’s details” page
    Then the page has the address previously selected or manually entered shown
    And I have the following fields "Organisation name",  a Contact details section with "Full name", "Email address", "Phone number", and an optional "Fax number"
    And I have the "save and continue" button
    And I have a "Back" link that returns me to “What’s the exporter’s address?”

  Scenario: Complete an Exporter's details
    Given that I’m on the exporter’s details screen
    When I have completed the exporter details
    And I click the save and continue button
    Then the page "Who's the importer?" is displayed
    And when I click "Save and return to draft" I am taken to the "Submit an export" page with the Exporter's detail set to "Completed"

  Scenario: Status reset to “In Progress” from “Completed”
    Given that the “Exporter details” is set to “Completed”
    When I navigate back to edit any section of  the exporter's details
    Then the status is reset to “In progress” until I have completed the exporter's details

  Scenario: Change the exporter's details after an initial save
    Given that I have previously saved the exporter's details
    When I navigate back to the page
    And the exporter’s details pre-filled
    Then I can change the details
    And the exporter's details status moves from “Completed” to “In progress” until the exporter's details are fully completed
    And the new entry overwrites the old entry on the backend

  Scenario: Partially completed exporter’s details
    Given the exporter’s details are partially completed
    When I click the “Save and return to draft” link
    Then the exporter’s details status on the “Submit and export” page is set to “In progress”



