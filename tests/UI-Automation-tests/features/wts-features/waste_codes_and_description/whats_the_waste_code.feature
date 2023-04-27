Feature: AS A waste producer/broker
  I NEED to add my waste code and description
  SO THAT I can correctly categorise and describe my waste export

  @ignore
  Scenario: EWC codes for the "Not applicable" option
    Given I login to waste tracking portal
    And I navigate to whats the waste code page
    When I choose Not applicable option
#    And I click the button Save and continue
#    Then Enter an EWC code is displayed
#    And I choose first EWC code description from list
    And I click the button Save and continue
    And I click "Back" link should display "What is the waste code" page

  Scenario: Display "laboratory details" as an option on the "submit an export" page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    When I navigate to You have added EWC codes page with Not applicable waste code
    And I click the Save and return to draft
    Then Submit an export page is displayed
#    And the task "Quantity of waste" should be "Not started"
    And the task "Laboratory details" should be "Not started"

  Scenario: Waste code selection
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    When I click the "Waste codes and description" link
    When I choose "Basel Annex IX" as a waste code
    And select a first option as waste code description
    And I click the Save and return to draft
    When I click the "Waste codes and description" link
    Then "Basel Annex IX" is still selected
    And waste code description is displayed

  Scenario: Not applicable selection
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    When I click the "Waste codes and description" link
    When I choose "Not applicable" as a waste code
    And I click the Save and return to draft
    When I click the "Waste codes and description" link
    Then "Not applicable" is still selected

  Scenario: Status "Recovery facility" and "Waste codes and description" as an option on the "submit an export" page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    When I click the "Waste codes and description" link
    When I choose "Basel Annex IX" as a waste code
    And select a first option as waste code description
    And I click the Save and return to draft
    Then the task "Waste codes and description" should be "In progress"
    And the task "Recovery Facility or laboratory" should be "Not started"

  Scenario: Continue without selecting any waste code
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    When I click the "Waste codes and description" link
    And I click the button Save and continue
    Then I remain on the what is the waste code page with an "Select a waste code" error message displayed

  Scenario Outline: Continue without selecting any waste code options from the list
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    When I click the "Waste codes and description" link
    And I choose "<option>" as a waste code
    And I click the button Save and continue
    Then I remain on the what is the waste code page with an "<error_message>" error message displayed
    Examples:
      | option         | error_message                     |
      | Basel Annex IX | Enter a Basel Annex IX waste code |
      | OECD           | Enter an OECD waste code          |
      | Annex IIIA     | Enter an Annex IIIA waste code    |
      | Annex IIIB     | Enter an Annex IIIB waste code    |
