@overview
Feature: AS A Waste Producer/Broker
  I NEED to submit an Annex 7 form
  SO THAT my waste can be processed for export


  Scenario: Verify Green list waste overview page
    Given I login to waste tracking portal
    When I navigate to the overview page
    Then I can see all the sections
    And I can see links for each sections
