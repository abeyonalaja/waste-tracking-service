@UKMV @ignore
Feature: Start page
  I NEED to submit waste export
  SO THAT my waste can be processed

  @translation
  Scenario: User navigates to Start page and verifies its translated correctly
    Given I navigate to start page
    When the "Start" page is displayed
    Then I should see start page is correctly translated

