Feature: AS A waste producer/broker
  I NEED specify all countries the waste pass through
  SO THAT I can track the waste at any given point during transit

  @translation
  Scenario: User can see countries the waste travel and countries transit page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Countries waste will travel through" link
    And I choose "Yes" radio button
    Then I should see Are there any other countries the waste will travel through page correctly translated
    When I select other countries of waste
    And I click the button Save and continue
    Then I should see waste transit countries page correctly translated

  Scenario: User can't navigate without selecting the country the waste travel
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Countries waste will travel through" link
    And I click the button Save and continue
    Then I remain on the countries waste will travel page with an "Select yes if there are any other countries the waste will travel through" error message displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then I remain on the countries waste will travel page with an "Select or enter country" error message displayed
    And I click "Back" link should display "Submit an export" page

  Scenario: User can't navigate without selecting waste transit countries yes or no option
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Countries waste will travel through" link
    And I choose "Yes" radio button
    When I select other countries of waste
    And I click the button Save and continue
    And I click the button Save and continue
    Then I remain on the Waste transit countries page with an "Select yes if there are any other countries the waste will travel through" error message displayed

  Scenario: User can select no on other countries the waste travel
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Countries waste will travel through" link
    When I choose "No" radio button
    And I click the button Save and continue
    Then the task "Countries waste will travel through" should be "COMPLETED"

  Scenario: User can select no on country of transit
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Countries waste will travel through" link
    And I choose "Yes" radio button
    When I select other countries of waste
    And I click the button Save and continue
    When I choose "No" radio button
    And I click the button Save and continue
    Then the task "Countries waste will travel through" should be "COMPLETED"

  Scenario: User can see previously entered countries the waste travel
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Countries waste will travel through" link
    And I complete Countries waste will travel through with other country
    Then the task "Countries waste will travel through" should be "COMPLETED"
    When I click the "Countries waste will travel through" link
#    Then I should see previously entered country the waste travel pre-populated

  Scenario: User can add multiple countries waste will travel from waste transit
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Countries waste will travel through" link
    And I choose "Yes" radio button
    When I select other countries of waste
    And I click the button Save and continue
    And I choose "Yes" radio button
    And I select other countries of waste
#    Then I should see multiple countries the waste will travel in the correct order


#Need to add save and return scenarios
  #need to add remove and save


#
#  Number of sections completed
#    Given that the “Collection date”, Waste carriers”, “Waste collection details”, Location waste leaves the UK” and Countries waste will travel through” are set to completed
#    And the other sections “About the waste” and “Exporter and Importer” have been completed
#    Then the number of sections completed is 3 of 4
#
