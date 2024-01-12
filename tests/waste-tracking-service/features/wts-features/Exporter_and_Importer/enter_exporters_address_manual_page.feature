Feature: Exporter manual address page
  AS A waste producer
  I NEED to add the exporter’s details
  SO THAT the exporter can be tracker

  @translation
  Scenario: Exporter page displayed correctly
    Given I login to waste tracking portal
    When I navigate to Enter exporter address manual page
    And I should see page correctly translated
    And I click "Back" link should display "exporter address" page

  Scenario: User navigates to enter exporter address manually page and completes it
    Given I login to waste tracking portal
    When I navigate to Enter exporter address manual page
    And I verify Enter exporter address manual page is displayed
    And I complete the Enter exporter address manual page
    And I click the button Save and continue
    Then the "check exporter address" page is displayed

  Scenario: User enters the exporter address manually, save the draft and returns to exporter details page
    Given I login to waste tracking portal
    When I navigate to Enter exporter address manual page
    And I verify Enter exporter address manual page is displayed
    And I complete the Enter exporter address manual page
    When I click the Save and return to draft
    Then the "task list" page is displayed
    And the task "Exporter details" should be "IN PROGRESS"
    And I click the "Exporter details" link
    Then the "Enter Exporter Address Manual" page is displayed

  Scenario: User changes address details from Change address link after saving
    Given I login to waste tracking portal
    When I navigate to Enter exporter address manual page
    And I verify Enter exporter address manual page is displayed
    And I complete the Enter exporter address manual page
    When I click the button Save and continue
    And the "Check exporter address" page is displayed
    And I click the "Change" link
    Then the "exporter address" page is displayed
    Then I should see manually entered exporter details pre-populated

  Scenario: User enter valid input on all required field on the manual address entry page
    Given I login to waste tracking portal
    When I navigate to Enter exporter address manual page
    And I verify Enter exporter address manual page is displayed
    And I enter valid input for all the fields on the manual address entry page
    And I click the button Save and continue
    Then the "Check exporter address" page is displayed

  Scenario: User not entering any input on the mandatory fields and click save and continue button
    Given I login to waste tracking portal
    When I navigate to Enter exporter address manual page
    And I verify Enter exporter address manual page is displayed
    And I click the button Save and continue
    And I remain on the exporter address page with an "Enter a town or city" error message displayed
    And I remain on the exporter address page with an "Select a country" error message displayed
    And I remain on the exporter address page with an "Enter an address" error message displayed

  Scenario: User not entering any input on the mandatory fields and click save and return to draft
    Given I login to waste tracking portal
    When I navigate to Enter exporter address manual page
    And I verify Enter exporter address manual page is displayed
    And I click the Save and return to draft
    And I remain on the enter exporter address manual page with an "Enter a town or city" error message displayed
    And I remain on the enter exporter address manual page with an "Select a country" error message displayed
    And I remain on the enter exporter address manual page with an "Enter an address" error message displayed
