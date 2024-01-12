Feature: Location waste leaves UK
  AS A waste producer/broker exporting GLW waste
  I NEED to specify the location where the waste leave the UK
  SO THAT the I provide visibility of the exit point

  @translation
  Scenario: User navigates to Location waste leave the UK page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Location waste leaves the UK" link
    Then the "Location waste leaves the UK" page is displayed
    And I choose "Yes" radio button
    And I should see Location waste leave page correctly translated

  Scenario: User enter location and click Save and continue
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Location waste leaves the UK" link
    Then the "Location waste leaves the UK" page is displayed
    And I choose "Yes" radio button
    And I enter location
    And I click the button Save and continue
     Then the "Countries Waste Will Travel" page is displayed

  Scenario: User chose No option and click Save and continue
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Location waste leaves the UK" link
    Then the "Location waste leaves the UK" page is displayed
    And I choose "No" radio button
    And I click the button Save and continue
     Then the "Countries Waste Will Travel" page is displayed

  Scenario: User can see previously entered details displayed
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Location waste leaves the UK" link
    Then the "Location waste leaves the UK" page is displayed
    And I choose "Yes" radio button
    And I enter location
    And I click the Save and return to draft
    Then the "task list" page is displayed
    And the task "Location waste leaves the UK" should be "COMPLETED"
    And I click the "Location waste leaves the UK" link
    Then the "Location waste leaves the UK" page is displayed
    And I can see previously entered location details pre-populated

  Scenario: User edit already entered details and save them
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Location waste leaves the UK" link
    Then the "Location waste leaves the UK" page is displayed
    And I choose "Yes" radio button
    And I enter location
    And I click the Save and return to draft
    Then the "task list" page is displayed
    And the task "Location waste leaves the UK" should be "COMPLETED"
    And I click the "Location waste leaves the UK" link
    Then I can see previously entered location details pre-populated
    And I choose "No" radio button
    And I click the Save and return to draft
    And I click the "Location waste leaves the UK" link
    Then I can see newly chosen option pre-populated

  Scenario: Error validations on Location waste leave the UK page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Location waste leaves the UK" link
    Then the "Location waste leaves the UK" page is displayed
    And I click the button Save and continue
    Then I remain on the Location waste leaves the UK page with an "Select yes if you know where the waste will leave the UK" error message displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then I remain on the Location waste leaves the UK page with an "Enter the location" error message displayed


