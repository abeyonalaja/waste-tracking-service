Feature: Automation to check accessibility tool

  Scenario: Check WTS Accessibility
    Given I login to waste tracking portal
    When I navigate to the overview page
    Then the page should be axe clean
    Then the page should be axe clean within "main"; excluding "aside"


