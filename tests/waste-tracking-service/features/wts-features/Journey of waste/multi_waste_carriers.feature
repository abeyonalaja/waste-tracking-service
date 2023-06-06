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
