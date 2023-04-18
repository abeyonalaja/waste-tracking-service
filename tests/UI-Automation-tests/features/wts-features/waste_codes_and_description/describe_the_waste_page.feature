Feature: AS A waste producer/broker
  I NEED to add my waste code description details
  SO THAT I can correctly categorise and describe my waste export

  Scenario: Add waste description field length for description
    Given I login to waste tracking portal
    And I navigate on the Describe the waste
    When I add a description of the waste up to 100 characters
    Then the number of characters decreases on the counter

  Scenario: Back link should navigate the user back to National code page
    Given I login to waste tracking portal
    And I navigate on the Describe the waste
    When I add a description of the waste up to 100 characters
    Then I click "Back" link should display "National code" page

  Scenario: Can't continue without completing Describe the waste
    Given I login to waste tracking portal
    And I navigate on the Describe the waste
    When I click the button Save and continue
    Then I remain on the Describe the waste page with an "Enter a description" error message displayed

  #commented the code until EWC page is completed
#  Scenario:Waste code and description status update
#    Given I login to waste tracking portal
#    And I navigate on the Describe the waste
#    When I click the link Return to this draft later
#    Then the task "Waste codes and description" should be "COMPLETED"
#
