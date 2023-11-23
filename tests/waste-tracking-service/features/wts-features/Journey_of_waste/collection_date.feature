Feature: AS A waste producer/broker
  I NEED to set the date for the collection of waste
  SO THAT waste can be removed

  @translation
  Scenario: Collection date page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Collection date" link
    Then the "collection date" page is displayed
    And I should see collection date page correctly translated
    When I choose "Yes, I’ll enter the actual date" radio button
    Then I should see actual collection date helper text correctly translated
    When I choose "No, I’ll enter an estimate date" radio button
    Then I should see estimate collection date helper text correctly translated

  Scenario: Enter an estimated date of collection of waste, task should set to complete
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Collection date" link
    And I choose "No, I’ll enter an estimate date" radio button
    And I enter valid Estimate collection date
    And I click the button Save and continue
    Then the "who is the waste carrier" page is displayed
    And I complete the Who is the waste carrier page
    And I click the Save and return to draft
    Then the task "Collection date" should be "COMPLETED"
    And I click the "Collection date" link
    Then I should see Collection date option "No, I’ll enter an estimate date" is selected
    And I should see Estimate Collection date pre-populated

  Scenario: Enter an Actual date of collection of waste, task should set to complete
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Collection date" link
    And I choose "Yes, I’ll enter the actual date" radio button
    And I enter valid Actual collection date
    And I click the button Save and continue
    Then the "who is the waste carrier" page is displayed
    And I complete the Who is the waste carrier page
    And I click the Save and return to draft
    Then the task "Collection date" should be "COMPLETED"
    And I click the "Collection date" link
    Then I should see Collection date option "Yes, I’ll enter the actual date" is selected
    And I should see Actual Collection date pre-populated

  Scenario: User can change Collection date from Estimated to actual
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Collection date" link
    And I choose "No, I’ll enter an estimate date" radio button
    And I enter valid Estimate collection date
    And I click the button Save and continue
    Then the "who is the waste carrier" page is displayed
    And I complete the Who is the waste carrier page
    And I click the Save and return to draft
    Then the task "Collection date" should be "COMPLETED"
    And I click the "Collection date" link
    And I choose "Yes, I’ll enter the actual date" radio button
    And I enter valid Actual collection date
    And I click the button Save and continue
    Then the "who is the waste carrier" page is displayed
    And I complete the Who is the waste carrier page
    And I click the Save and return to draft
    Then the task "Collection date" should be "COMPLETED"
    And I click the "Collection date" link
    Then I should see Collection date option "Yes, I’ll enter the actual date" is selected
    And I should see Actual Collection date pre-populated

  Scenario: User can't continue without selecting collection date option
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Collection date" link
    And I click the button Save and continue
    Then I remain on the collection date page with an "Select yes if you know when the waste will be collected" error message displayed
    When I click the Save and return to draft
    Then I remain on the collection date page with an "Select yes if you know when the waste will be collected" error message displayed


  Scenario: User can't continue without entering collection date
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Collection date" link
    And I choose "Yes, I’ll enter the actual date" radio button
    And I click the button Save and continue
    Then I remain on the collection date page with an "Enter a real date" error message displayed
    When I click the Save and return to draft
    Then I remain on the collection date page with an "Enter a real date" error message displayed

  Scenario: User can't enter past date for collection date
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Collection date" link
    And I choose "Yes, I’ll enter the actual date" radio button
    When I enter past collection date
    And I click the button Save and continue
    Then I remain on the collection date page with an "Enter a date in the future" error message displayed
    When I click the Save and return to draft
    Then I remain on the collection date page with an "Enter a date in the future" error message displayed

  Scenario: User can't enter 3 days from the current date
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Collection date" link
    And I choose "Yes, I’ll enter the actual date" radio button
    When I enter collection date within 3 days
    And I click the button Save and continue
    Then I remain on the collection date page with an "Enter a date at least 3 business days in the future" error message displayed
    When I click the Save and return to draft
    Then I remain on the collection date page with an "Enter a date at least 3 business days in the future" error message displayed



