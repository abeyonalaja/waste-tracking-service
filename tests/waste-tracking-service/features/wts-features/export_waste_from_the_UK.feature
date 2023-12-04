@overview
Feature: AS A Waste Producer/Broker
  I NEED to submit an Annex 7 form
  SO THAT my waste can be processed for export

  Scenario: Verify Export waste from the UK page
    Given I login to waste tracking portal
    When Export waste from UK page is displayed
    Then I can see all the sections
    And I can see links for each sections
