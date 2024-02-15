Feature: Countries waste will travel page
  AS A waste producer/broker
  I NEED specify all countries the waste pass through
  SO THAT I can track the waste at any given point during transit

  @translation
  Scenario: User can see countries the waste travel and countries transit page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Countries waste will travel through" link
    And I choose "Yes" radio button
    Then I should see Are there any other countries the waste will travel through page correctly translated
    When I select other countries of waste
    And I click the button Save and continue
    Then I should see waste transit countries page correctly translated

  Scenario: User can't navigate without selecting the country the waste travel
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Countries waste will travel through" link
    And I click the button Save and continue
    Then I remain on the countries waste will travel page with an "Select yes if there are any other countries the waste will travel through" error message displayed
    When I click the Save and return to draft
    Then I remain on the countries waste will travel page with an "Select yes if there are any other countries the waste will travel through" error message displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then I remain on the countries waste will travel page with an "Select or enter country" error message displayed
    When I click the Save and return to draft
    Then I remain on the countries waste will travel page with an "Select or enter country" error message displayed
    And I click "Back" link should display "task list" page

  Scenario: User can't navigate without selecting waste transit countries yes or no option
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Countries waste will travel through" link
    And I choose "Yes" radio button
    When I select other countries of waste
    And I click the button Save and continue
    And I wait for a second
    And I click the button Save and continue
    Then I remain on the Waste transit countries page with an "Select yes if there are any other countries the waste will travel through" error message displayed
    When I click the Save and return to draft
    Then I remain on the Waste transit countries page with an "Select yes if there are any other countries the waste will travel through" error message displayed

  Scenario: User can select no on other countries the waste travel
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Countries waste will travel through" link
    When I choose "No" radio button
    And I click the button Save and continue
    Then the task "Countries waste will travel through" should be "COMPLETED"

  Scenario: User can select no on country of transit
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Countries waste will travel through" link
    And I choose "Yes" radio button
    When I select other countries of waste
    And I click the button Save and continue
    And I wait for a second
    When I choose "No" radio button
    And I click the button Save and continue
    Then the task "Countries waste will travel through" should be "COMPLETED"

  Scenario: User can see previously entered countries the waste travel
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Countries waste will travel through" link
    And I complete Countries waste will travel through with other country
    Then the task "Countries waste will travel through" should be "COMPLETED"
    When I click the "Countries waste will travel through" link
    Then I should see previously entered country the waste travel pre-populated

  Scenario: User can add multiple countries waste will travel from waste transit
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Countries waste will travel through" link
    And I choose "Yes" radio button
    When I select other countries of waste
    And I click the button Save and continue
    And I wait for a second
    And I choose "Yes" radio button
    And I select other countries of waste
    And I click the button Save and continue
    Then I should see multiple countries the waste will travel in the correct order

  @translation
  Scenario: User can change the transit country and new country should be saved and task should be completed
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Countries waste will travel through" link
    And I choose "Yes" radio button
    When I select other countries of waste
    And I click the button Save and continue
    When I click the "Change" link
    Then I should see change waste will travel through page correctly displayed
    When I change the country of waste travel to new country
    And I click the button Save and continue
    Then I should see new entered country the waste travel pre-populated
    When I choose "No" radio button
    And I click the button Save and continue
    Then the task "Countries waste will travel through" should be "COMPLETED"

  @translation
  Scenario: User can remove the transit country and task should be COMPLETED
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Countries waste will travel through" link
    And I choose "Yes" radio button
    When I select other countries of waste
    And I click the button Save and continue
    When I click the "Remove" link
    Then I should see Remove waste will travel through page correctly displayed
    When I choose "Yes" radio button
    When I click the button Save and continue
    Then the "countries waste will travel" page is displayed
    When I choose "No" radio button
    And I click the Save and return to draft
    Then the task "Countries waste will travel through" should be "COMPLETED"
    When I click the "Countries waste will travel through" link
    Then I should see No option is preselected on other country page

  Scenario: User can't continue without selecting a country on change the transit country page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Countries waste will travel through" link
    And I choose "Yes" radio button
    When I select other countries of waste
    And I click the button Save and continue
    When I click the "Change" link
    And I click the button Save and continue
    Then I remain on the change waste travel country page with an "Select or enter country" error message displayed
    When I click the Save and return to draft
    Then I remain on the change waste travel country page with an "Select or enter country" error message displayed
    And I click "Back" link should display "Waste transit countries" page

  Scenario: User can't continue from remove the transit country without selecting a remove option
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Countries waste will travel through" link
    And I choose "Yes" radio button
    When I select other countries of waste
    And I click the button Save and continue
    When I click the "Remove" link
    And I click the button Save and continue
    Then I remain on the remove waste travel country page with an "Select yes if you want to remove this country" error message displayed
    When I click the Save and return to draft
    Then I remain on the remove waste travel country page with an "Select yes if you want to remove this country" error message displayed

  Scenario: Completed sections need to update when user complete collection
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I have 3 of 5 sections completed
