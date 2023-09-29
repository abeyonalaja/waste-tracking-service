Feature: AS A waste producer/broker
  I NEED TO add waste carrier details
  SO THAT I have information to trace the waste carrier

  @translation
  Scenario: Navigate to Who is the carrier page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Waste carriers" link
    Then the "Who is the waste carrier" page is displayed
    And I should see Who is the waste carrier page translated
    And I click "Back" link should display "task list" page

  @translation
  Scenario: User navigates to Whats are the waste carriers contact details page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Waste carriers" link
    Then the "who is the waste carrier" page is displayed
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    Then I should see "what are the waste carriers contact details" page is displayed
    And I should see Whats is the waste carriers contact details page translated

  Scenario: User completes Who is the waste carrier page and click Save and return
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Waste carriers" link
    Then the "who is the waste carrier" page is displayed
    And I complete the Who is the waste carrier page
    And I click the Save and return to draft
    Then the "task list" page is displayed
    And the task "Waste carriers" should be "IN PROGRESS"
    When I click the "Waste carriers" link
    Then the "who is the waste carrier" page is displayed
    And I see previously entered waste carrier details pre-populated

  Scenario: User navigates to What are the waste carriers contact details page and click Save an return
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Waste carriers" link
    Then the "who is the waste carrier" page is displayed
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    Then I should see "what are the waste carriers contact details" page is displayed
    And I complete the Whats is the waste carriers contact details page
    And I click the Save and return to draft
    Then the "task list" page is displayed
    And the task "waste carriers" should be "IN PROGRESS"
    When I click the "Waste carriers" link
    Then the "who is the waste carrier" page is displayed
    And I see previously entered waste carrier details pre-populated
    And I click the button Save and continue
    Then I see previously entered Waste carrier contact details pre-populated

  Scenario: User completes What are the waste carriers contact details page and click Save and continue
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Waste carriers" link
    Then the "who is the waste carrier" page is displayed
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    Then I should see "what are the waste carriers contact details" page is displayed
    And I complete the Whats is the waste carriers contact details page
    And I click the button Save and continue
    #Then the "How will the waste carrier transport the waste" page is displayed

  Scenario: Error validations on Who is the waste carrier page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Waste carriers" link
    Then the "who is the waste carrier" page is displayed
    And I click the button Save and continue
    Then I remain on the who is the waste carrier page with an "Enter an organisation name" error message displayed
    And I remain on the who is the waste carrier page with an "Enter a country" error message displayed
    And I remain on the who is the waste carrier page with an "Enter an address" error message displayed

  Scenario: Error validations on What are the waste carriers contact details page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Waste carriers" link
    Then the "who is the waste carrier" page is displayed
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    Then I should see "what are the waste carriers contact details" page is displayed
    And I click the button Save and continue
    Then I remain on the what are the waste carriers contact details page with an "Enter a full name" error message displayed
    And I remain on the what are the waste carriers contact details page with an "Enter an email address" error message displayed
    And I remain on the what are the waste carriers contact details page with an "Enter a phone number" error message displayed

