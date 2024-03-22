Feature: Add Importer details page
  AS A waste producer
  I NEED to add the importer’s details
  SO THAT the importer can be tracked

  @translation
  Scenario: User navigates to Who is the importer page from Importer details link
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Importer details" link
    Then the "who is the importer" page is displayed
    And I should see Who is the importer page translated
    And I click "Back" link should display "task list" page

  @translation
  Scenario: User navigates to What are the importers contact details page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Importer details" link
    Then the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    And I should see What are the importers contact details page translated

  Scenario: User completes Importer contact details and lands on task list page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Importer details" link
    Then the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    And I complete Importer contact details page
    And I click the Save and return to draft
    Then the "task list" page is displayed
    And the task "Importer details" should be "COMPLETED"

  Scenario: User completes Who is the importer page and Click save and return to draft link
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Importer details" link
    Then the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the Save and return to draft
    Then the "task list" page is displayed
    And the task "Importer details" should be "IN PROGRESS"

  Scenario: User can see previously saved details on the Who is the importer page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Importer details" link
    Then the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the Save and return to draft
    And I click the "Importer details" link
    Then I verify that previously entered details are pre-populated

  Scenario: User click Save and continue without entering any values on Who is the importer page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Importer details" link
    Then the "who is the importer" page is displayed
    And I click the button Save and continue
    Then I remain on the who is the importer page with an "Enter an organisation name" error message displayed
    And I remain on the who is the importer page with an "Enter a country" error message displayed
    And I remain on the who is the importer page with an "Enter an address" error message displayed
    And I click "Back" link should display "task list" page

  Scenario: User click Save and continue without entering any values on Importer contact details page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Importer details" link
    Then the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    And I click the button Save and continue
    Then I remain on the Importer contact details page with an "Enter a full name" error message displayed
    And I remain on the Importer contact details page with an "Enter an email address" error message displayed
    And I remain on the Importer contact details page with an "Enter a phone number" error message displayed

  Scenario: User can see previously saved details Importer contact details page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Importer details" link
    Then the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    And I complete Importer contact details page
    And I click the button Save and continue
    Then I click the "Importer details" link
    And  I click the button Save and continue
    Then I verify that previously entered details are pre-populated on the Importer contact details page

  Scenario: User enter invalid fax number
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Importer details" link
    Then the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    And I enter invalid fax code
    And I click the button Save and continue
    Then I remain on the Importer contact details page with an "Enter a real fax number" error message displayed
    And I enter invalid international fax code
    And I click the button Save and continue
    Then I remain on the Importer contact details page with an "Enter a real fax number" error message displayed

  Scenario: User enters invalid phone number on Importer details page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Importer details" link
    Then the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    And I enter invalid phone number
    And I click the button Save and continue
    Then I remain on the Importer contact details page with an "Enter a real phone number" error message displayed

  Scenario: User verifies that transit country cannot be the same as the importer country
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Importer details" link
    Then the "who is the importer" page is displayed
    And I complete who is the importer page with first country from the list
    Then I click the Save and return to draft
    And I click the "Countries waste will travel through" link
    And I choose "Yes" radio button
    And I select the first country
    And I click the button Save and continue
    Then I remain on the Countries waste will travel page with an "The transit country cannot be the same as the importer country" error message displayed
    And I click the Save and return to draft
    Then I remain on the Countries waste will travel page with an "The transit country cannot be the same as the importer country" error message displayed

  Scenario: User verifies that importer country cannot be the same as the transit country
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Countries waste will travel through" link
    And I choose "Yes" radio button
    And I select the first country
    And I click the Save and return to draft
    And I click the "Importer details" link
    Then the "who is the importer" page is displayed
    And I complete who is the importer page with first country from the list
    Then I click the button Save and continue
    Then I remain on the who is the importer page with an "The importer country cannot be the same as the transit country" error message displayed
    And I click the Save and return to draft
    Then I remain on the who is the importer page with an "The importer country cannot be the same as the transit country" error message displayed
