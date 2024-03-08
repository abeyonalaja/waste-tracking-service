Feature: Laboratory details page
  I NEED to be able to add a laboratory facility details
  SO THAT if there is a need for the waste to be returned it can be moved to the laboratory facility

  @translation
  Scenario: User can complete Laboratory facility details when enter small waste description
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I complete Waste codes and description task with "Not applicable" has waste code
    Then the task "Waste codes and description" should be "COMPLETED"
    And the task "Laboratory details" should be "NOT STARTED"
    When I click the "Laboratory details" link
    Then I should see laboratory address correctly translated
    When I complete laboratory address details
    Then I should see laboratory contact details correctly translated
    When I complete laboratory contact details
    Then I should see disposal code page correctly translated
    When I complete disposal code page
    Then task list page is displayed
    Then the task "Laboratory details" should be "COMPLETED"

  Scenario: User enters invalid phone number on Laboratory contact details page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I complete Waste codes and description task with "Not applicable" has waste code
    Then the task "Waste codes and description" should be "COMPLETED"
    And the task "Laboratory details" should be "NOT STARTED"
    When I click the "Laboratory details" link
    When I complete laboratory address details
    Then the "Laboratory contact details" page is displayed
    When I enter invalid phone number for laboratory details
    And I click the button Save and continue
    And I remain on the Laboratory contact details page with an "Enter a real phone number" error message displayed

  Scenario: User can't continue without completing mandatory data in laboratory details pages
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I complete Waste codes and description task with "Not applicable" has waste code
    When I click the "Laboratory details" link
    And I wait for a second
    And I click the button Save and continue
    Then I remain on the Laboratory address page with an "Enter the laboratory name" error message displayed
    And I remain on the Laboratory address page with an "Enter an address" error message displayed
    And I remain on the Laboratory address page with an "Enter a country" error message displayed
    When I click the Save and return to draft
    Then I remain on the Laboratory address page with an "Enter the laboratory name" error message displayed
    And I remain on the Laboratory address page with an "Enter an address" error message displayed
    And I remain on the Laboratory address page with an "Enter a country" error message displayed
    When I complete laboratory address details
    And I click the button Save and continue
    Then I remain on the Laboratory contact details page with an "Enter a full name" error message displayed
    And I remain on the Laboratory contact details page with an "Enter an email address" error message displayed
    And I remain on the Laboratory contact details page with an "Enter a phone number" error message displayed
    When I click the Save and return to draft
    Then I remain on the Laboratory contact details page with an "Enter a full name" error message displayed
    And I remain on the Laboratory contact details page with an "Enter an email address" error message displayed
    And I remain on the Laboratory contact details page with an "Enter a phone number" error message displayed
    When I complete laboratory contact details
    And I click the button Save and continue
    Then I remain on the disposal code page with an "Enter a disposal code" error message displayed
    And I click the Save and return to draft
    Then I remain on the disposal code page with an "Enter a disposal code" error message displayed
    When I complete disposal code page
    Then task list page is displayed
    Then the task "Laboratory details" should be "COMPLETED"

  Scenario: Partial completed laboratory details, task should set to be IN PROGRESS and Data should be pre-populated
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I complete Waste codes and description task with "Not applicable" has waste code
    And I wait for a second
    When I click the "Laboratory details" link
    And I complete laboratory address details
    And I click "Back" link should display "Laboratory address" page
    Then I should see previously entered Laboratory address details pre-populated
    And I click "Back" link should display "task list" page
    Then the task "Laboratory details" should be "IN PROGRESS"
    When I click the "Laboratory details" link
    And I click the button Save and continue
    And I complete laboratory contact details
    And I click the button Save and continue
    And I complete disposal code page
    Then the task "Laboratory details" should be "COMPLETED"
    When I click the "Laboratory details" link
    And I click the button Save and continue
    Then I should see previously entered laboratory contact details pre-populated
    And I click the button Save and continue
    Then I should see disposal code details pre-populated

  Scenario: Laboratory details task should disappear when user change waste code from Small to Bulk
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I complete Waste codes and description task with "Not applicable" has waste code
    Then the task "Waste codes and description" should be "COMPLETED"
    And the task "Laboratory details" should be "NOT STARTED"
    When I click the "Laboratory details" link
    And I complete laboratory address details
    And I complete laboratory contact details
    And I complete disposal code page
    And I click the "Waste codes and description" link
    When I change the waste code from small to bulk waste
    And I click the Save and return to draft
    And the task "Recovery facility details" should be "NOT STARTED"

  Scenario: User enter not valid fax number on laboratory details page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I complete Waste codes and description task with "Not applicable" has waste code
    Then the task "Waste codes and description" should be "COMPLETED"
    And the task "Laboratory details" should be "NOT STARTED"
    When I click the "Laboratory details" link
    When I complete laboratory address details
    Then the "Laboratory contact details" page is displayed
    And I enter not valid fax number
    And I click the button Save and continue
    Then I remain on the Laboratory contact details page with an "Enter a real fax number" error message displayed
    And I enter not valid international fax number
    And I click the button Save and continue
    Then I remain on the Laboratory contact details page with an "Enter a real fax number" error message displayed










