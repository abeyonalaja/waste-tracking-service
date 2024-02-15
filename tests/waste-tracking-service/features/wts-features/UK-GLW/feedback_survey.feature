Feature: AS A Waste Manager
  I NEED To be able to provide feedback on the service
  SO THAT I can provide a rating of the service and express my view of the service

  @translation
  Scenario: User navigate to feedback survey page
    Given I login to waste tracking portal
    When I click the "feedback" link
    Then the "Feedback Survey" page is displayed
    And I verify feedback page is correctly translated




