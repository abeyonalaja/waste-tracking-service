Feature: AS A Waste practitioner
  I NEED to be able to continue with a draft export after saving
  SO THAT I complete the export submission at my convenience with all the relevant details

  @translation
  Scenario: User can navigate to empty incomplete Annex VII page
    Given I login to waste tracking portal
    And I click the "Green list waste overview" link
    When I click the "Continue a draft export" link
    Then I should see empty draft Annex VII page

  @translation
  Scenario: User can save draft after application reference
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    When I click the link Return to this draft later
    Then the "Export waste from uk" page is displayed
    When I click the "Manage incomplete Annex VII records" link
    Then I should see draft Annex VII records page
    # need to check below step
    # And I should see draft records page correctly translated
    Then I should see my draft application saved on the top
    And  I should see correct date on draft application page
    When I click the first continue link
    Then Submit an export page is displayed
    And the reference should be displayed

  Scenario: User can save draft application after completing all the tasks
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    When I click the link Return to this draft later
    When I click the "Manage incomplete Annex VII records" link
    Then I should see draft Annex VII records page
    # need to check below step
    # And I should see draft records page correctly translated
    Then I should see my draft application saved on the top
    And  I should see correct date on draft application page
    And I should see waste code on draft application page
    When I click the first continue link
    Then Submit an export page is displayed
    And the reference should be displayed
    And the task "Waste codes and description" should be "COMPLETED"
    And the task "Quantity of waste" should be "COMPLETED"
    And the task "Exporter details" should be "COMPLETED"
    And the task "Importer details" should be "COMPLETED"
    And the task "Waste collection details" should be "COMPLETED"
    And the task "Waste carriers" should be "COMPLETED"
    And the task "Location waste leaves the UK" should be "COMPLETED"
    And the task "Countries waste will travel through" should be "COMPLETED"
    And the task "Recovery facility or laboratory" should be "COMPLETED"


