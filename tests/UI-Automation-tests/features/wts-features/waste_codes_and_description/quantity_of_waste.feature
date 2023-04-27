@ignore
Feature: AS A waste producer
  I NEED to add the waste quantity for an export
  SO THAT the weight or volume of the waste can be calculated and recorded

  @translation
  Scenario: Launch quantity of waste page from Submit an export page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    And the task "Waste codes and description" should be "COMPLETED"
    When I click the "Quantity of waste" link
    When the page quality of waste page is displayed
    Then I have options "Yes, I know the actual amount"
    And I have options "No, I will enter an estimate"
    And I have options "No, I do not know the amount yet"
    And I click "Back" link should display "Submit an export" page

  Scenario: Launch quantity of waste page after entering description of the waste
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page
    When I click the button Save and continue
    When the page quality of waste page is displayed
    And I click "Back" link should display "Describe the waste" page

  @translation
  Scenario: Display actual quantity unit options for waste
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page
    When I choose "Yes, I know the actual amount" radio button
    And I click the button Save and continue
    Then the What is the actual net weight of the waste is displayed
    And I should see net weight page is correctly translated
    Then I have options "Weight in tonnes"
    And I have options "Volume in cubic metres"

  Scenario: Entering the actual unit amount weight for the waste quantity and About waste section is updated
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page
    When I choose "Yes, I know the actual amount" radio button
    And I click the button Save and continue
    And I choose "Weight in tonnes" radio button
    And I enter valid weight in tonnes
    And I click the button Save and continue
    Then the task "Quantity of waste	" should be "COMPLETED"
    When I click the "Quantity of waste" link
    Then I should see quantity option "Yes, I know the actual amount" is selected
    And I click the button Save and continue
    Then I should see previously entered weight in tonnes pre-populated

  Scenario: Changing the quantity of waste from net to estimate after saving the initial entry
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page
    When I choose "Yes, I know the actual amount" radio button
    And I click the button Save and continue
    And I choose "Weight in tonnes" radio button
    And I enter valid weight in tonnes
    And I click the Save and return to draft
    Then the task "Quantity of waste	" should be "COMPLETED"
    When I click the "Quantity of waste" link
    And I choose "No, I will enter an estimate" radio button
    And I click the button Save and continue
    And I enter valid weight in cubic meters
    And I click the button Save and continue
    Then the task "Quantity of waste" should be "COMPLETED"
    And I have 1 of 4 sections completed
    When I click the "Quantity of waste" link
    Then I should see quantity option "No, I will enter an estimate" is selected
    And I click the button Save and continue
    Then I should see previously entered weight in cubic meters pre-populated

  Scenario: Unknown waste quantity amount
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page
    When I choose "No, I do not know the amount yet" radio button
    And I click the button Save and continue
    Then the task "Quantity of waste" should be "NOT STARTED"

  Scenario:  Quantity of waste task status when user don't enter weight should be In Progress
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page
    When I choose "Yes, I know the actual amount" radio button
    And I click the Save and return to draft
    Then the task "Quantity of waste	" should be "IN PROGRESS"

  Scenario: User can't continue without selecting quantity of waste option
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page
    When I click the button Save and continue
    Then I remain on the Quantity of waste page with an "Enter the actual/estimated net weight or volume of waste" error message displayed
    When I click the Save and return to draft
    Then I remain on the Quantity of waste page with an "Enter the actual/estimated net weight or volume of waste" error message displayed

  Scenario: User can't continue without entering quantity of units option
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page
    When I choose "Yes, I know the actual amount" radio button
    And I click the button Save and continue
    And I click the button Save and continue
    Then I remain on the Net weight page with an "Enter weight or volume of the waste" error message displayed
    When I click the Save and return to draft
    Then I remain on the Net weight page with an "Enter weight or volume of the waste" error message displayed

  Scenario: User can't enter special character in quantity of units option
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page
    When I choose "Yes, I know the actual amount" radio button
    And I click the button Save and continue
    When I enter invalid weight in cubic meters
    And I click the button Save and continue
    Then I remain on the Net weight page with an "Enter weight or volume of the waste" error message displayed
    When I enter invalid weight in tonnes
    And I click the button Save and continue
    Then I remain on the Net weight page with an "Enter weight or volume of the waste" error message displayed

