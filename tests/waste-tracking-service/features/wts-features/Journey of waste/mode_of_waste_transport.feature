Feature: AS A waste producer/broker
  I NEED to be able to add a mode transport for my waste
  SO THAT I describe how the waste will be moved to end destination

  @translation
  Scenario: User navigates to mode of transport page
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Waste carriers" link
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I complete the Whats is the waste carriers contact details page
    And I click the button Save and continue
    Then the "how will the waste carrier transport the waste" page is displayed
    And I should see How will the waste carrier transport the waste page translated
    And I click "Back" link should display "what are the waste carriers contact details" page

  @translation
  Scenario: User navigates to mode of transport page and choose Road option
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Waste carriers" link
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I wait for a second
    And I complete the Whats is the waste carriers contact details page
    And I wait for a second
    And I click the button Save and continue
    Then I should see "how will the waste carrier transport the waste" page is displayed
    And I choose "Road" radio button
    And I click the button Save and continue
    Then the "Road transport details" page is displayed
    And I should see road transport details page translated
    And I enter details about the transport
    And I click the button Save and continue
    Then Then the "Multi waste carriers" page is displayed
    And I choose "No" radio button
    And I click the button Save and continue
    Then Then the "Waste collection details" page is displayed

  @translation
  Scenario: User navigates to mode of transport page and choose Sea option
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Waste carriers" link
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I complete the Whats is the waste carriers contact details page
    And I wait for a second
    And I click the button Save and continue
    Then I should see "how will the waste carrier transport the waste" page is displayed
    And I choose "Sea" radio button
    And I click the button Save and continue
    Then the "Sea transport details" page is displayed
    And I should see Sea transport details page translated
    And I enter details about the transport
    And I click the button Save and continue
    Then Then the "Multi waste carriers" page is displayed
    And I choose "No" radio button
    And I click the button Save and continue
    Then Then the "Waste collection details" page is displayed

  @translation
  Scenario: User navigates to mode of transport page and choose Air option
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Waste carriers" link
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I complete the Whats is the waste carriers contact details page
    And I click the button Save and continue
    Then I should see "how will the waste carrier transport the waste" page is displayed
    And I choose "Air" radio button
    And I click the button Save and continue
    Then the "Air transport details" page is displayed
    And I should see Air transport details page translated
    And I enter details about the transport
    And I click the button Save and continue
    Then Then the "Multi waste carriers" page is displayed
    And I choose "No" radio button
    And I click the button Save and continue
    Then Then the "Waste collection details" page is displayed

  @translation
  Scenario: User navigates to mode of transport page and choose Rail option
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Waste carriers" link
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I complete the Whats is the waste carriers contact details page
    And I click the button Save and continue
    Then I should see "how will the waste carrier transport the waste" page is displayed
    And I choose "Rail" radio button
    And I click the button Save and continue
    Then the "Rail transport details" page is displayed
    And I should see Rail transport details page translated
    And I enter details about the transport
    And I click the button Save and continue
    Then Then the "Multi waste carriers" page is displayed
    And I choose "No" radio button
    And I click the button Save and continue
    Then Then the "Waste collection details" page is displayed

  @translation
  Scenario: User navigates to mode of transport page and choose Inland waterways option
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Waste carriers" link
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I complete the Whats is the waste carriers contact details page
    And I click the button Save and continue
    Then I should see "how will the waste carrier transport the waste" page is displayed
    And I choose "Inland waterways" radio button
    And I click the button Save and continue
    Then the "Inland water transport details" page is displayed
    And I should see inland waterways transport details page translated
    And I enter details about the transport
    And I click the button Save and continue
    Then Then the "Multi waste carriers" page is displayed
    And I choose "No" radio button
    And I click the button Save and continue
    Then Then the "Waste collection details" page is displayed

  Scenario: User can't continue without choosing an mode of transport option
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Waste carriers" link
    And I wait for a second
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I complete the Whats is the waste carriers contact details page
    And I click the button Save and continue
    Then I should see "how will the waste carrier transport the waste" page is displayed
    And I click the button Save and continue
    Then I remain on the how will the waste carrier transport the waste page with an "Select how the first waste carrier will transport the waste" error message displayed

  Scenario: User can't continue if character limit is exceeded on mode of transport details
    Given I login to waste tracking portal
    When I navigate to the task list page with reference
    And I click the "Waste carriers" link
    And I wait for a second
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I complete the Whats is the waste carriers contact details page
    And I click the button Save and continue
    Then I should see "how will the waste carrier transport the waste" page is displayed
    And I choose "Rail" radio button
    And I click the button Save and continue
    And I enter more than allowed charaters on details about the transport
    And I click the button Save and continue
    Then I remain on the Rail transport details page with an "The first carrier's rail transportation details must be 200 characters or less" error message displayed
