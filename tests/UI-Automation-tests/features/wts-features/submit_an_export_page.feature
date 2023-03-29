Feature: AS A Waste Producer/Broker
  I NEED to submit waste export
  SO THAT my waste can be processed

  Scenario: Reference number should be displayed on Submit an export page
  Given I login to waste tracking portal
  And I navigate to the add reference page
  When I have selected Yes and entered my reference
  Then Submit an export page is displayed
  And the reference should be displayed

  Scenario: Verify Submit an export page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    Then I have submission incomplete 0 of 4 sections
    And I see these four sections and their current statuses
    And links within each are pointing to the corresponding pages

