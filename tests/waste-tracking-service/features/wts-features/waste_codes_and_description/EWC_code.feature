@add_ewc_code
Feature:AS A waste producer
  I NEED to be able to add my EWC code
  SO THAT I can classify my waste based on the European categorisation

  @translation
  Scenario: Checking Add EWC code and verify its saved
    Given I login to waste tracking portal
    When I navigate to Add EWC code page
    Then I verify copy text is present on the EWC page
    When I enter valid ewc code
    And I click the button Save and continue
    Then I should see ewc code description on EWC list page
    And I verify Do you need to add another page is displayed

  Scenario: User can't continue without entering EWC code
    Given I login to waste tracking portal
    Then I navigate to Add EWC code page
    And I click the button Save and continue
    Then I remain on the Enter an ewc code page with an "Enter a code" error message displayed
    When I enter invalid EWC code less then 6 digit
    And I click the Save and return to draft
    Then I remain on the Enter an ewc code page with an "Enter a code with 6 digits" error message displayed
    When I enter invalid EWC code
    And I click the button Save and continue
    Then I remain on the Enter an ewc code page with an "Enter a code in the correct format" error message displayed
    When I enter valid ewc code
    And I click the button Save and continue
    And I choose "Yes" radio button
    And I enter valid ewc code
    When I click the button Save and continue
    Then I remain on the EWC code list page with an "You have already entered this code" error message displayed

  Scenario: User should see previously selected option pre-populated when user navigated back to do you have EWC code page
    Given I login to waste tracking portal
    When I navigate to Add EWC code page
    And I enter valid ewc code
    And I click the Save and return to draft
    Then I verify that task list page is displayed
    When I click the "Waste codes and description" link
    Then "Basel Annex IX" is still selected
    And I click the button Save and continue
    Then I should see ewc code description on EWC list page
    And I verify Do you need to add another page is displayed

  Scenario: User can't continue without selection YES or NO on EWC list page
    Given I login to waste tracking portal
    When I navigate to Add EWC code page
    And I enter valid ewc code
    And I click the button Save and continue
    Then I verify Do you need to add another page is displayed
    When I click the button Save and continue
    Then I remain on the Ewc Code list page with an "Select yes if you have an EWC code" error message displayed

  Scenario: User can add EWC code when user select Not applicable waste code
    Given I login to waste tracking portal
    When I navigate to ewc code page with selecting Not applicable option on waste code page
    Then I verify enter ewc code page is displayed
    When I enter valid ewc code
    And I click the button Save and continue
    Then I should see ewc code description on EWC list page
    And I verify Do you need to add another page is displayed

  Scenario: User can remove an EWC code from ewc codes list page
    Given I login to waste tracking portal
    When I navigate to Add EWC code page
    When I enter valid ewc code
    And I click the button Save and continue
    Then I should see ewc code description on EWC list page
    And I verify Do you need to add another page is displayed
    When I click the "Remove" link
    Then I verify confirmation page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then Enter an EWC code is displayed

  Scenario: User can't add more than 5 EWC codes to an export
    Given I login to waste tracking portal
    When I navigate to Add EWC code page
    When I enter valid ewc code
    And I click the button Save and continue
    Then I verify Do you need to add another page is displayed
    When I add 4 ewc codes
    Then I should see 5 EWC code added to the export
    And I verify Do you need to add another EWC code question is not present on the page

  Scenario: User navigate back from Do you have ewc code page
    Given I login to waste tracking portal
    When I navigate to Add EWC code page
    Then I verify add ewc code page is displayed
    And I click "Back" link should display "What is the waste code" page
    Then "Basel Annex IX" is still selected

