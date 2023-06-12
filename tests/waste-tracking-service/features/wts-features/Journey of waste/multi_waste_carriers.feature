Feature: AS A waste producer/broker
  I NEED TO add waste carrier details
  SO THAT I have information to trace the waste carrier

  @translation
  Scenario: User should see waste carrier details on the carriers page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    And I complete the "first" waste carrier with "Shipping container"
    Then I should see add carrier correctly translated
    And I should see first waste carrier displayed
    And I should see only change link for first waste carrier
    When I choose "No" radio button
    And I click the button Save and continue
    Then the task "Waste carriers" should be "COMPLETED"
    When I click the "Waste carriers" link
    Then the "Multi waste carriers" page is displayed
    And I should see first waste carrier displayed
    And I should see only change link for first waste carrier

  @translation
  Scenario: User can add upto 5 waste carriers
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    And I complete the "First" waste carrier with "Shipping container"
    And I choose "Yes" radio button
    And I click the button Save and continue
    And I complete the "Second" waste carrier with "Shipping container"
    And I choose "Yes" radio button
    And I click the button Save and continue
    And I complete the "Third" waste carrier with "Shipping container"
    And I choose "Yes" radio button
    And I click the button Save and continue
    And I complete the "Fourth" waste carrier with "Shipping container"
    And I choose "Yes" radio button
    And I click the button Save and continue
    And I complete the "Fifth" waste carrier with "Shipping container"
    Then I should see max waste carrier correctly translated
    And I should see five waste carrier details displayed
    And I should see org nam and country for each waste carries
    And I should see change and remove links for each waste carriers
    And I click the Save and return to draft
    Then the task "Waste carriers" should be "COMPLETED"
    When I click the "Waste carriers" link
    Then the "Multi waste carriers" page is displayed
    Then I should see max waste carrier correctly translated
    And I should see five waste carrier details displayed
    And I should see org nam and country for each waste carries
    And I should see change and remove links for each waste carriers

  Scenario: User can change previously entered waste carrier details
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    And I complete the "first" waste carrier with "Shipping container"
    Then I should see add carrier correctly translated
    And I should see first waste carrier displayed
    When I click the "Change" link
    Then I see previously entered waste carrier details pre-populated
    When I update first waste carrier Organisation name details
    And I click the button Save and continue
    Then I see previously entered Waste carrier contact details pre-populated
    And I click the button Save and continue
    Then I should see "Shipping container" to be checked
    And I choose "Bulk vessel" radio button
    When I click the button Save and continue
    And I enter IMO number
    And I click the button Save and continue
    And I should see org nam and country for each waste carries

  Scenario: User can't continue from Remove waste carriers page and can remove previously entered waste carrier details
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    And I complete the "First" waste carrier with "Shipping container"
    And I choose "Yes" radio button
    And I click the button Save and continue
    And I complete the "Second" waste carrier with "Shipping container"
    Then I should see org nam and country for each waste carries
    And I should see change and remove links for each waste carriers
    And I click the last "Remove" link
    Then the "remove this waste carrier" page is displayed
    When I click the button Save and continue
    Then I remain on the remove this waste carrier page with an "Select yes if you want to remove this carrier" error message displayed
    When I choose "No" radio button
    When I click the button Save and continue
    Then I should see org nam and country for each waste carries
    And I should see change and remove links for each waste carriers
    When I click the last "Remove" link
    When I choose "Yes" radio button
    When I click the button Save and continue
    Then the "Multi waste carriers" page is displayed
    And I should see first waste carrier displayed
    And I should see only change link for first waste carrier

  Scenario: User can navigate back from change waste carriers flow
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    And I complete the "First" waste carrier with "Shipping container"
    And I choose "Yes" radio button
    And I click the button Save and continue
    And I complete the "Second" waste carrier with "Shipping container"
    When I click the last "Change" link
    Then the who is the second waste carriers page is displayed














