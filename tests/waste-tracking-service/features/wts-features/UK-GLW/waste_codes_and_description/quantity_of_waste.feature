Feature: Quantity of waste page
  I NEED to add the waste quantity for an export
  SO THAT the weight or volume of the waste can be calculated and recorded

  @translation
  Scenario: Launch quantity of waste page from task list page for bulk waste
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I complete Waste codes and description task
    And the task "Waste codes and description" should be "COMPLETED"
    When I click the "Quantity of waste" link
    When the quantity of bulk waste page is displayed
    Then I should see quantity of waste correctly translated
    And I click "Back" link should display "task list" page

  Scenario: Launch quantity of waste page after entering description of the waste
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    When I click the button Save and continue
    When the quantity of bulk waste page is displayed
    And I click "Back" link should display "Describe the waste" page

  Scenario: Launch quantity of waste page and click I dont know yet option
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    When I click the button Save and continue
    When the quantity of bulk waste page is displayed
    Then I choose "I don't know the amount yet" radio button
    And I click the button Save and continue
    Then the task "Quantity of waste" should be "IN PROGRESS"

  @translation
  Scenario: User can navigate to estimate bulk quantity page from Actual bulk quantity page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    When I choose "Actual weight (tonnes)" radio button
    And I click the button Save and continue
    Then the What is the actual net weight of the waste is displayed
    And I should see net weight page is correctly translated
    When I click the "enter an estimate instead" link
    Then the What is the estimate net bulk tonne weight of the waste is displayed
    And I should see estimate net bulk tonne weight page is correctly translated
    And I click "Back" link should display "Quantity of bulk waste" page
    And I click "Back" link should display "Describe the waste" page

  @translation
  Scenario: User can navigate to Actual bulk quantity page Actual volume from estimate bulk quantity page Estimated volume
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    When I choose "Estimated volume (m³)" radio button
    And I click the button Save and continue
    Then the What is the estimate net volume of the waste is displayed
    And I should see estimate net volume page is correctly translated
    When I click the "Enter an actual volume instead" link
    Then the What is the actual net volume of the waste is displayed
    And I should see actual net volume page is correctly translated
    And I click "Back" link should display "Quantity of bulk waste" page
    And I click "Back" link should display "Describe the waste" page

  Scenario: Entering the actual unit amount weight for the waste quantity and About waste section is updated
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    When I choose "Actual weight (tonnes)" radio button
    And I click the button Save and continue
    And I enter valid weight in tonnes
    And I click the button Save and continue
    Then the task "Quantity of waste" should be "COMPLETED"
    When I click the "Quantity of waste" link
    Then I should see quantity option "Actual weight (tonnes)" is selected
    And I click the button Save and continue
    Then I should see previously entered weight in tonnes pre-populated

  Scenario: Changing the quantity of waste from actual tonnes to estimate volume after saving the initial entry
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    When I choose "Actual weight (tonnes)" radio button
    And I click the button Save and continue
    And I enter valid weight in tonnes
    And I click the Save and return to draft
    Then the task "Quantity of waste" should be "COMPLETED"
    When I click the "Quantity of waste" link
    And I choose "Estimated volume (m³)" radio button
    And I click the button Save and continue
    And I enter valid weight in cubic meters
    And I click the button Save and continue
    Then the task "Quantity of waste" should be "COMPLETED"
    And I have 1 of 5 sections completed
    When I click the "Quantity of waste" link
    Then I should see quantity option "Estimated volume (m³)" is selected
    And I click the button Save and continue
    Then I should see previously entered weight in cubic meters pre-populated

  Scenario:User can choose Actual bulk waste page from estimated bulk waste page and back link should navigate the user to quantity of waste page
    Given I login to waste tracking portal
    And I navigate to whats the waste code page
    When I choose "Basel Annex IX" radio button
    And select a first option as waste code description
    And I click the Save and return to draft
    And I click the "Quantity of waste" link
    Then the quantity of small waste page is displayed
    When I choose "Estimated weight (tonnes)" radio button
    When I click the button Save and continue
    Then the What is the estimate net bulk tonne weight of the waste is displayed
    When I click the "Enter an actual weight instead" link
    Then What is the actual net bulk tonne weight of the waste is displayed
    And I click "Back" link should display "Quantity of bulk Waste" page
    And I click "Back" link should display "Task list" page
    Then the task "Quantity of waste" should be "IN PROGRESS"

  Scenario: Unknown waste quantity amount
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    When I choose "I don't know the amount yet" radio button
    And I click the button Save and continue
    Then the task "Quantity of waste" should be "IN PROGRESS"

  Scenario:  Quantity of waste task status when user don't enter weight should be In Progress
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    When I choose "Actual volume (m³)" radio button
    And I click the Save and return to draft
    Then the task "Quantity of waste" should be "IN PROGRESS"

  Scenario: User can't continue without selecting quantity of waste option
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    When I click the button Save and continue
    Then the quantity of bulk waste page is displayed
    And I click the button Save and continue
    Then I remain on the Quantity of bulk waste page with an "Select the quantity of waste" error message displayed
    When I click the Save and return to draft
    Then I remain on the Quantity of bulk waste page with an "Select the quantity of waste" error message displayed

  Scenario: User can't continue without entering quantity of units option
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    When I choose "Actual weight (tonnes)" radio button
    And I click the button Save and continue
    Then the What is the actual net weight of the waste is displayed
    And I click the button Save and continue
    Then I remain on the Actual bulk tonne weight page with an "Enter quantity" error message displayed
    When I click the Save and return to draft
    Then I remain on the Actual bulk tonne weight page with an "Enter quantity" error message displayed
    When I click the "enter an estimate instead" link
    And I click the button Save and continue
    Then I remain on the Estimate bulk tonne weight page with an "Enter quantity" error message displayed
    When I click the Save and return to draft
    Then I remain on the Estimate bulk tonne weight page with an "Enter quantity" error message displayed
    And I click "Back" link should display "Quantity of bulk waste" page
    When I choose "Actual volume (m³)" radio button
    And I click the button Save and continue
    Then the What is the actual net volume of the waste is displayed
    When I click the button Save and continue
    Then I remain on the Actual bulk volume weight page with an "Enter quantity" error message displayed
    When I click the Save and return to draft
    Then I remain on the Actual bulk volume weight page with an "Enter quantity" error message displayed
    When I click the "enter an estimate instead" link
    And I click the button Save and continue
    Then I remain on the Estimate bulk volume weight page with an "Enter quantity" error message displayed
    When I click the Save and return to draft
    Then I remain on the Estimate bulk volume weight page with an "Enter quantity" error message displayed

  Scenario: User can't enter special character in quantity of units option
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    When I choose "Actual weight (tonnes)" radio button
    And I click the button Save and continue
    When I enter invalid weight in tonnes
    And I click the button Save and continue
    Then I remain on the Actual bulk tonne weight page with an "Enter quantity using only numbers" error message displayed
    And I click the Save and return to draft
    Then I remain on the Actual bulk tonne weight page with an "Enter quantity using only numbers" error message displayed
    When I enter zero weight in tonnes
    And I click the button Save and continue
    Then I remain on the Actual bulk tonne weight page with an "The quantity needs to be greater than 0" error message displayed
    And I click the Save and return to draft
    Then I remain on the Actual bulk tonne weight page with an "The quantity needs to be greater than 0" error message displayed
    When I click the "enter an estimate instead" link
    When I enter invalid weight in tonnes
    And I click the button Save and continue
    Then I remain on the Estimate bulk tonne weight page with an "Enter quantity using only numbers" error message displayed
    When I click the Save and return to draft
    Then I remain on the Estimate bulk tonne weight page with an "Enter quantity using only numbers" error message displayed
    When I enter zero weight in tonnes
    And I click the button Save and continue
    Then I remain on the Estimate bulk tonne weight page with an "The quantity needs to be greater than 0" error message displayed
    When I click the Save and return to draft
    Then I remain on the Estimate bulk tonne weight page with an "The quantity needs to be greater than 0" error message displayed
    And I click "Back" link should display "Quantity of bulk waste" page
    When I choose "Actual volume (m³)" radio button
    And I click the button Save and continue
    Then the What is the actual net volume of the waste is displayed
    And I enter invalid weight in cubic meters
    When I click the button Save and continue
    Then I remain on the Actual bulk volume weight page with an "Enter quantity using only numbers" error message displayed
    When I click the Save and return to draft
    Then I remain on the Actual bulk volume weight page with an "Enter quantity using only numbers" error message displayed
    And I enter zero weight in cubic meters
    When I click the button Save and continue
    Then I remain on the Actual bulk volume weight page with an "The quantity needs to be greater than 0" error message displayed
    When I click the Save and return to draft
    Then I remain on the Actual bulk volume weight page with an "The quantity needs to be greater than 0" error message displayed
    When I click the "enter an estimate instead" link
    And I click the button Save and continue
    And I wait for a second
    And I enter invalid weight in cubic meters
    And I click the button Save and continue
    Then I remain on the Estimate bulk volume weight page with an "Enter quantity using only numbers" error message displayed
    When I click the Save and return to draft
    Then I remain on the Estimate bulk volume weight page with an "Enter quantity using only numbers" error message displayed
    And I enter zero weight in cubic meters
    When I click the button Save and continue
    Then I remain on the Estimate bulk volume weight page with an "The quantity needs to be greater than 0" error message displayed
    When I click the Save and return to draft
    Then I remain on the Estimate bulk volume weight page with an "The quantity needs to be greater than 0" error message displayed

    ######## Small waste
  @translation
  Scenario:Launch quantity of waste page after entering description of the waste for small waste
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I click the "Waste codes and description" link
    And I complete the Waste code and description task with small waste
    Then the quantity of small waste page is displayed
    And I should see quantity of small waste correctly translated
    And I click "Back" link should display "Describe the waste" page

  Scenario:Launch quantity of waste page for small waste and click I dont know yet option
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I click the "Waste codes and description" link
    And I complete the Waste code and description task with small waste
    When the quantity of small waste page is displayed
    And I choose "I don't know the amount yet" radio button
    And I click the button Save and continue
    Then the task "Quantity of waste" should be "IN PROGRESS"

  @translation
  Scenario:Display actual quantity unit option for small waste
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page with "Not applicable" has waste code
    Then the quantity of small waste page is displayed
    When I click the button Save and continue
    And I choose "Actual weight (kilograms)" radio button
    And I click the button Save and continue
    Then What is the actual net weight of the small weight waste is displayed
    And I should see net small weight page is correctly translated
    And I click "Back" link should display "Quantity of small waste" page
    When I choose "Estimated weight (kilograms)" radio button
    And I click the button Save and continue
    Then the What is the estimate net weight of the small weight waste is displayed
    And I should see estimate net small weight page is correctly translated

  Scenario:User can choose estimated small waste page from actual small waste page and back link should navigate the user to quantity of waste page
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page with "Not applicable" has waste code
    Then the quantity of small waste page is displayed
    When I choose "Actual weight (kilograms)" radio button
    When I click the button Save and continue
    Then What is the actual net weight of the small weight waste is displayed
    When I click the "enter an estimate instead" link
    Then the What is the estimate net weight of the small weight waste is displayed
    And I click "Back" link should display "Quantity of small Waste" page
    And I click "Back" link should display "Describe the waste" page

  Scenario:User can choose Actual small waste page from estimated small waste page and back link should navigate the user to quantity of waste page
    Given I login to waste tracking portal
    And I navigate to whats the waste code page
    When I choose "Not applicable" radio button
    And I click the Save and return to draft
    And I click the "Quantity of waste" link
    Then the quantity of small waste page is displayed
    When I choose "Estimated weight (kilograms)" radio button
    When I click the button Save and continue
    Then the What is the estimate net weight of the small weight waste is displayed
    When I click the "Enter an actual weight instead" link
    Then What is the actual net weight of the small weight waste is displayed
    And I click "Back" link should display "Quantity of small Waste" page
    And I click "Back" link should display "Task list" page
    Then the task "Quantity of waste" should be "IN PROGRESS"

  Scenario:User can check quantity of waste from actual to estimated
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page with "Not applicable" has waste code
    When I choose "Actual weight (kilograms)" radio button
    And I click the button Save and continue
    And I enter valid weight in kilograms
    And I click the Save and return to draft
    Then the task "Quantity of waste" should be "COMPLETED"
    When I click the "Quantity of waste" link
    And I choose "Estimated weight (kilograms)" radio button
    And I click the button Save and continue
    And I enter valid weight in kilograms
    And I click the button Save and continue
    Then the task "Quantity of waste" should be "COMPLETED"
    And I have 1 of 5 sections completed
    When I click the "Quantity of waste" link
    Then I should see quantity option "Estimated weight (kilograms)" is selected
    And I click the button Save and continue
    Then I should see previously entered weight in kilograms pre-populated

  Scenario:User didn't enter quantity of small waste, then quantity of waste status should be In Progress
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page with "Not applicable" has waste code
    When I choose "Actual weight (kilograms)" radio button
    And I click the button Save and continue
    And I enter valid weight in kilograms
    And I click the Save and return to draft
    Then the task "Quantity of waste" should be "COMPLETED"
    When I click the "Quantity of waste" link
    And I choose "Estimated weight (kilograms)" radio button
    And I click the Save and return to draft
    Then the task "Quantity of waste" should be "IN PROGRESS"

  Scenario:User can't continue without selecting any option
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page with "Not applicable" has waste code
    Then the quantity of small waste page is displayed
    When I click the button Save and continue
    And I remain on the Quantity of small waste page with an "Select the quantity of waste" error message displayed
    When I choose "Actual weight (kilograms)" radio button
    And I click the button Save and continue
    Then What is the actual net weight of the small weight waste is displayed
    When I click the button Save and continue
    Then I remain on the Net small weight page with an "Enter quantity" error message displayed
    When I click "Back" link should display "Quantity of small waste" page
    And I choose "Estimated weight (kilograms)" radio button
    And I click the button Save and continue
    Then the What is the estimate net weight of the small weight waste is displayed
    And I click the button Save and continue
    And I remain on the Estimate small weight page with an "Enter quantity" error message displayed

  Scenario: User change the waste code from Not Applicable to other options then quantity of waste should be rest
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page with "Not applicable" has waste code
    When I choose "Actual weight (kilograms)" radio button
    And I click the button Save and continue
    And I enter valid weight in kilograms
    And I click the Save and return to draft
    Then the task "Quantity of waste" should be "COMPLETED"
    When I click the "Waste codes and description" link
    When I choose "Basel Annex IX" as a waste code
    And select a first option as waste code description
    And I click the Save and return to draft
    Then the task "Quantity of waste" should be "NOT STARTED"
    When I click the "Quantity of waste" link
    Then I should see quantity option "Actual weight (kilograms)" is not selected
    And I should see quantity option "Estimated weight (kilograms)" is not selected
    And I should see quantity option "No, I do not know the amount yet" is not selected

  Scenario: User change the waste code from other options to Not applicable then quantity of waste should be rest
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page
    When I choose "Actual weight (tonnes)" radio button
    And I click the button Save and continue
    And I enter valid weight in tonnes
    And I click the Save and return to draft
    Then the task "Quantity of waste" should be "COMPLETED"
    When I click the "Waste codes and description" link
    When I choose "Not applicable" as a waste code
    And I click the Save and return to draft
    Then the task "Quantity of waste" should be "NOT STARTED"
    When I click the "Quantity of waste" link
    Then I should see quantity option "Actual weight (kilograms)" is not selected
    And I should see quantity option "Estimated weight (kilograms)" is not selected
    And I should see quantity option "No, I do not know the amount yet" is not selected

  Scenario: Small weight user can't enter special character in quantity of units option
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page with "Not applicable" has waste code
    When I choose "Actual weight (kilograms)" radio button
    And I click the button Save and continue
    And I enter invalid weight in kilograms
    And I click the button Save and continue
    Then I remain on the Net small weight page with an "Enter quantity using only numbers" error message displayed
    When I click "Back" link should display "Quantity of small waste" page
    And I choose "Estimated weight (kilograms)" radio button
    And I click the button Save and continue
    And I enter invalid weight in kilograms
    And I click the button Save and continue
    Then I remain on the Estimate small weight page with an "Enter quantity using only numbers" error message displayed

  Scenario: Small weight user can't enter more than 25kgs
    Given I login to waste tracking portal
    And I navigate to the task list page with reference
    And I navigate to Quantity of waste page with "Not applicable" has waste code
    When I choose "Actual weight (kilograms)" radio button
    And I click the button Save and continue
    And I enter weight more than 25 kilograms
    And I click the button Save and continue
    Then I remain on the Net small weight page with an "Enter a weight 25kg or under" error message displayed

