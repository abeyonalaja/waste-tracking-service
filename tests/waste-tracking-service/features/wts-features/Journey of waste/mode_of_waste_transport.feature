Feature: AS A waste producer/broker
  I NEED to be able to add a mode transport for my waste
  SO THAT I describe how the waste will be moved to end destination

@translation
  Scenario: User navigates to mode of transport page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I complete the Whats is the waste carriers contact details page
    And I click the button Save and continue
    Then the "how will the waste carrier transport the waste" page is displayed
    And I should see How will the waste carrier transport the waste page translated
    And I click "Back" link should display "what are the waste carriers contact details" page

  @translation
  Scenario: User navigates to mode of transport page and choose Shipping container option
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I complete the Whats is the waste carriers contact details page
    And I click the button Save and continue
    Then I should see "how will the waste carrier transport the waste" page is displayed
    And I choose "Shipping container" radio button
    And I click the button Save and continue
    Then the "Shipping container details" page is displayed
    And I should see Shipping container page translated
    And I enter shipping container number
    And I click the button Save and continue
    #Then I should see "Your added carriers" page is displayed

  @translation
  Scenario: User navigates to mode of transport page and choose Trailer option
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I complete the Whats is the waste carriers contact details page
    And I click the button Save and continue
    Then I should see "how will the waste carrier transport the waste" page is displayed
    And I choose "Trailer" radio button
    And I click the button Save and continue
    Then the "Trailer details" page is displayed
    And I should see Trailer page translated
    And I enter vehicle registration number
    And I click the button Save and continue
    #Then I should see "Your added carriers" page is displayed

  @translation
  Scenario: User navigates to mode of transport page and choose Bulk vessel option
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I complete the Whats is the waste carriers contact details page
    And I click the button Save and continue
    Then I should see "how will the waste carrier transport the waste" page is displayed
    And I choose "Bulk vessel" radio button
    And I click the button Save and continue
    Then the "Bulk vessel details" page is displayed
    And I should see Bulk vessel page translated
    And I enter IMO number
    And I click the button Save and continue
    #Then I should see "Your added carriers" page is displayed

  Scenario: User can't continue without entering Shipping container details
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I complete the Whats is the waste carriers contact details page
    And I click the button Save and continue
    Then I should see "how will the waste carrier transport the waste" page is displayed
    And I choose "Shipping container" radio button
    And I click the button Save and continue
    Then the "Shipping container details" page is displayed
    And I click the button Save and continue
    Then I remain on the Shipping container details page with an "Enter a shipping container number" error message displayed

  Scenario: User can't continue without entering Trailer details
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I complete the Whats is the waste carriers contact details page
    And I click the button Save and continue
    Then I should see "how will the waste carrier transport the waste" page is displayed
    And I choose "Trailer" radio button
    And I click the button Save and continue
    Then the "Trailer details" page is displayed
    And I click the button Save and continue
    Then I remain on the Trailer details page with an "Enter a vehicle registration number" error message displayed

  Scenario: User can't continue without entering Bulk vessel details
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I complete the Whats is the waste carriers contact details page
    And I click the button Save and continue
    Then I should see "how will the waste carrier transport the waste" page is displayed
    And I choose "Bulk vessel" radio button
    And I click the button Save and continue
    Then the "Bulk vessel details" page is displayed
    And I click the button Save and continue
    Then I remain on the Bulk vessel details page with an "Enter an international maritime organisation (IMO) number" error message displayed
