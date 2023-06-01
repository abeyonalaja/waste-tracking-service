Feature: AS A waste producer/broker
  I NEED TO add waste carrier details
  SO THAT I have information to trace the waste carrier

  @translation
  Scenario: Navigate to Who is the carrier page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    Then the "Who is the waste carrier" page is displayed
    And I should see Who is the waste carrier page translated
    And I click "Back" link should display "Submit an export" page

  @translation
  Scenario: User navigates to Whats are the waste carriers contact details page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    Then the "who is the waste carrier" page is displayed
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    Then I should see "what are the waste carriers contact details" page is displayed
    And I should see Whats is the waste carriers contact details page translated

  Scenario: User completes Who is the waste carrier page and click Save and return
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    Then the "who is the waste carrier" page is displayed
    And I complete the Who is the waste carrier page
    And I click the Save and return
    Then the "Submit an export" page is displayed
    And the task "Waste carriers" should be "IN PROGRESS"
    When I click the "Waste carriers" link
    Then the "who is the waste carrier" page is displayed
    And I see already entered details pre-populated

  Scenario: User navigates to What are the waste carriers contact details page and click Save an return
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    Then the "who is the waste carrier" page is displayed
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    Then I should see "what are the waste carriers contact details" page is displayed
    And I complete the Whats is the waste carriers contact details page
    And I click the Save and return
    Then the "Submit an export" page is displayed
    And the task "waste carriers" should be "IN PROGRESS"
    When I click the "Waste carriers" link
    Then the "who is the waste carrier" page is displayed
    And I see already entered details pre-populated
    And I click the button Save and continue
    Then I see Waste carrier details entered previously pre-populated

  Scenario: User completes What are the waste carriers contact details page and click Save and continue
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
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
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    Then the "who is the waste carrier" page is displayed
    And I click the button Save and continue
    Then I remain on the who is the waste carrier page with an "Enter an organisation name" error message displayed
    And I remain on the who is the waste carrier page with an "Enter a country" error message displayed
    And I remain on the who is the waste carrier page with an "Enter an address" error message displayed

  Scenario: Error validations on What are the waste carriers contact details page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    Then the "who is the waste carrier" page is displayed
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    Then I should see "what are the waste carriers contact details" page is displayed
    And I click the button Save and continue
    Then I remain on the what are the waste carriers contact details page with an "Enter an full name" error message displayed
    And I remain on the what are the waste carriers contact details page with an "Enter a real email" error message displayed
    And I remain on the what are the waste carriers contact details page with an "Enter a real phone number" error message displayed

