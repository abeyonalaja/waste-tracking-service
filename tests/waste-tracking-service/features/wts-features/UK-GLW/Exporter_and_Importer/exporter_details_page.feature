
Feature: Exporter details page
  AS A waste producer
  I NEED to add the exporter’s details
  SO THAT the exporter can be tracker

  Scenario: User can't return or continue without entering from exporter details
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I navigate to Check Exporter address details page with valid postcode
    Then I should check exporter address is displayed with Change address link on the page
    When I click the button Save and continue
    And I wait for a second
    And I click the button Save and continue
    Then I remain on the exporter details page with an "Enter an organisation name" error message displayed
    And I remain on the exporter details page with an "Enter a full name" error message displayed
    And I remain on the exporter details page with an "Enter a real email address" error message displayed
    And I remain on the exporter details page with an "Enter a real phone number" error message displayed
    When I click the Save and return to draft
    Then I remain on the exporter details page with an "Enter an organisation name" error message displayed
    And I remain on the exporter details page with an "Enter a full name" error message displayed
    And I remain on the exporter details page with an "Enter a real email address" error message displayed
    And I remain on the exporter details page with an "Enter a real phone number" error message displayed
    Then I click "Back" link should display "check exporter address" page

  Scenario: Complete Exporter details with via postcode search and details should be pre-populated when user navigate back
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I complete Exporter details with valid postcode
    And I click the Save and return to draft
    Then the task "Exporter details" should be "COMPLETED"
    When I click the "Exporter details" link
    Then I should check exporter address is displayed with Change address link on the page
    When I click the button Save and continue
    And I should see Exporter Organisation name pre-populated
    And I should see Exporter Full name name pre-populated
    And I should see Exporter Email address pre-populated
    And I should see Exporter Phone number pre-populated
    And I click "Back" link should display "check exporter address" page
    When I click the Save and return to draft
    Then the task "Exporter details" should be "COMPLETED"

  Scenario: Exporter details task is set to In Progress when user didn't enter Experter details
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I navigate to Check Exporter address details page with valid postcode
    Then I should check exporter address is displayed with Change address link on the page
    When I click "Back" link should display "exporter address" page
    And I click "Back" link should display "task list" page
    Then the task "Exporter details" should be "IN PROGRESS"

  Scenario: User can update exporter address details from exporter details page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I navigate to Check Exporter address details page with valid postcode
    And I click the "Change" link
    Then the "exporter address" page is displayed
    When I change exporter address with new address
    And I click the button Save and continue
    Then I should check exporter address is displayed with Change address link on the page

  Scenario: User can update exporter address details from exporter details page and save and return from manual entry page, task should be IN PROGRESS
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I navigate to Check Exporter address details page with valid postcode
    And I click the "Change" link
    Then the "exporter address" page is displayed
    When I change exporter address with new address
    And I click the Save and return to draft
    Then the task "Exporter details" should be "IN PROGRESS"
    When I click the "Exporter details" link
    Then I should see manually entered exporter details pre-populated
    When I click the button Save and continue
    Then I should check exporter address is displayed with Change address link on the page

  Scenario: User enter invalid fax number
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I navigate to Check Exporter address details page with valid postcode
    Then I should check exporter address is displayed with Change address link on the page
    When I click the button Save and continue
    And I wait for a second
    And I enter invalid fax code
    And I click the button Save and continue
    Then I remain on the exporter details page with an "Enter a real fax number" error message displayed
    And I enter invalid international fax code
    And I click the button Save and continue
    Then I remain on the exporter details page with an "Enter a real fax number" error message displayed
