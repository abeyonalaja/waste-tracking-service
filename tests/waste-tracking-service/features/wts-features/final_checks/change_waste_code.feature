Feature: AS A Waste practitioner
  I NEED to be warned about changing the waste code
  SO THAT I am aware of the implication the changes to waste code might cause to other details entered

  @translation
  Scenario: Change Bulk to Small waste code should reset the task status
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then the task "Quantity of waste" should be "COMPLETED"
    And the task "Waste codes and description" should be "COMPLETED"
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    Then the task "Exporter details" should be "COMPLETED"
    Then the task "Importer details" should be "COMPLETED"
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    Then the task "Recovery facility" should be "COMPLETED"
    And I click the "Check your report" link
    Then the "check your report" page is displayed
    When I click waste code Change link
    Then the "Change waste code" page is displayed
    And I verify Change waste code page is translated correctly
    And I click Continue and change waste code button
    Then the "What is the waste code" page is displayed
    And I choose "Not applicable" as a waste code
    And I click the Save and return to draft
    Then the "Submit an export" page is displayed
    And the task "Waste codes and description" should be "IN PROGRESS"
    And the task "Quantity of waste" should be "NOT STARTED"
    And the task "Laboratory details" should be "NOT STARTED"
    And the task "Waste carriers" should be "NOT STARTED"

  Scenario: Change Bulk to Small waste code and verify old data is cleared
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then the task "Quantity of waste" should be "COMPLETED"
    And the task "Waste codes and description" should be "COMPLETED"
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    Then the task "Exporter details" should be "COMPLETED"
    Then the task "Importer details" should be "COMPLETED"
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    Then the task "Recovery facility" should be "COMPLETED"
    And I click the "Check your report" link
    Then the "check your report" page is displayed
    When I click waste code Change link
    Then the "Change waste code" page is displayed
    And I click Continue and change waste code button
    Then the "What is the waste code" page is displayed
    And I choose "Not applicable" as a waste code
    And I click the button Save and continue
    Then the "Enter an ewc code" page is displayed
    And I enter valid ewc code
    And I click the button Save and continue
    And I choose "No" radio button
    And I click the button Save and continue
    Then the "National code" page is displayed
    And I click the button Save and continue
    Then the "Describe the waste" page is displayed
    And I verify data is wiped out

  Scenario: Change Small to Bulk waste code and verify old data is cleared
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page with "Not applicable" has waste code
    When I click the button Save and continue
    When the quality of small waste page is displayed
    When I choose "Yes, I know the actual amount" radio button
    And I click the button Save and continue
    And I enter valid weight in kilograms
    And I click the button Save and continue
    Then the task "Quantity of waste" should be "COMPLETED"
    And the task "Waste codes and description" should be "COMPLETED"
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    Then the task "Exporter details" should be "COMPLETED"
    Then the task "Importer details" should be "COMPLETED"
    And I click the "Collection date" link
    And I complete the Journey of a waste section with small waste
    Then I click the "Laboratory details" link
    And I complete laboratory address details
    And I complete laboratory contact details
    And I complete disposal code page
    Then the task "Laboratory details" should be "COMPLETED"
    And I click the "Check your report" link
    Then the "check your report" page is displayed
    When I click waste code Change link
    Then the "Change waste code" page is displayed
    And I click Continue and change waste code button
    Then the "What is the waste code" page is displayed
    And I choose "OECD" as a waste code
    And I select first OECD code
    And I wait for a second
    And I click the button Save and continue
    And I wait for a second
    Then Enter an EWC code is displayed
    And I enter valid ewc code
    And I click the button Save and continue
    And I choose "No" radio button
    And I click the button Save and continue
    Then the "National code" page is displayed
    And I click the button Save and continue
    Then the "Describe the waste" page is displayed
    And I verify data is wiped out

  Scenario: Change one Bulk waste code with another bulk waste code should reset the task status
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then the task "Quantity of waste" should be "COMPLETED"
    And the task "Waste codes and description" should be "COMPLETED"
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    Then the task "Exporter details" should be "COMPLETED"
    Then the task "Importer details" should be "COMPLETED"
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    Then the task "Recovery facility" should be "COMPLETED"
    And I click the "Check your report" link
    Then the "check your report" page is displayed
    When I click waste code Change link
    Then the "Change waste code" page is displayed
    And I click Continue and change waste code button
    Then the "What is the waste code" page is displayed
    And I choose "OECD" as a waste code
    And I select first OECD code
    And I click the Save and return to draft
    Then the "Submit an export" page is displayed
    And the task "Waste codes and description" should be "IN PROGRESS"
    And the task "Quantity of waste" should be "NOT STARTED"
    And the task "Laboratory details" should be "NOT STARTED"
    And the task "Waste carriers" should be "NOT STARTED"

  Scenario: Change one Bulk waste code with another bulk waste code and verify data is cleared
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then the task "Quantity of waste" should be "COMPLETED"
    And the task "Waste codes and description" should be "COMPLETED"
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    Then the task "Exporter details" should be "COMPLETED"
    Then the task "Importer details" should be "COMPLETED"
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    Then the task "Recovery facility" should be "COMPLETED"
    And I click the "Check your report" link
    Then the "check your report" page is displayed
    When I click waste code Change link
    Then the "Change waste code" page is displayed
    And I click Continue and change waste code button
    Then the "What is the waste code" page is displayed
    And I choose "OECD" as a waste code
    And I select first OECD code
    And I click the button Save and continue
    And I wait for a second
    Then Enter an EWC code is displayed
    And I enter valid ewc code
    And I click the button Save and continue
    And I choose "No" radio button
    And I click the button Save and continue
    Then the "National code" page is displayed
    And I click the button Save and continue
    Then the "Describe the waste" page is displayed
    And I verify data is wiped out


  Scenario: Change from one Basel Annex IX code to another Basel Annex IX code should reset the task status to In Progress
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then the task "Quantity of waste" should be "COMPLETED"
    And the task "Waste codes and description" should be "COMPLETED"
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    Then the task "Exporter details" should be "COMPLETED"
    Then the task "Importer details" should be "COMPLETED"
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    Then the task "Recovery facility" should be "COMPLETED"
    And I click the "Check your report" link
    Then the "check your report" page is displayed
    When I click waste code Change link
    Then the "Change waste code" page is displayed
    And I click Continue and change waste code button
    Then the "What is the waste code" page is displayed
    And I select new Basel Annex IX code
    And I click the Save and return to draft
    Then the "Submit an export" page is displayed
    And the task "Waste codes and description" should be "IN PROGRESS"
    And the task "Quantity of waste" should be "IN PROGRESS"
    And the task "Recovery facility" should be "IN PROGRESS"
    And the task "Waste carriers" should be "IN PROGRESS"

  Scenario: Change from one Basel Annex IX code to another Basel Annex IX code and verify data is cleared
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then the task "Quantity of waste" should be "COMPLETED"
    And the task "Waste codes and description" should be "COMPLETED"
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    Then the task "Exporter details" should be "COMPLETED"
    Then the task "Importer details" should be "COMPLETED"
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    Then the task "Recovery facility" should be "COMPLETED"
    And I click the "Check your report" link
    Then the "check your report" page is displayed
    When I click waste code Change link
    Then the "Change waste code" page is displayed
    And I click Continue and change waste code button
    Then the "What is the waste code" page is displayed
    And I select new Basel Annex IX code
    And I click the button Save and continue
    And I wait for a second
    Then Enter an EWC code is displayed
    And I enter valid ewc code
    And I click the button Save and continue
    And I choose "No" radio button
    And I click the button Save and continue
    Then the "National code" page is displayed
    And I click the button Save and continue
    Then the "Describe the waste" page is displayed
    And I verify data is wiped out

  Scenario: User click return to draft button on Change waste code page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then the task "Quantity of waste" should be "COMPLETED"
    And the task "Waste codes and description" should be "COMPLETED"
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    Then the task "Exporter details" should be "COMPLETED"
    Then the task "Importer details" should be "COMPLETED"
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    Then the task "Recovery facility" should be "COMPLETED"
    And I click the "Check your report" link
    Then the "check your report" page is displayed
    When I click waste code Change link
    Then the "Change waste code" page is displayed
    And I click Return to draft button
    Then the "Submit an export" page is displayed

  Scenario: User click back button on Change waste code page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Quantity of waste page
    And I complete Quantity of waste sub-section
    Then the task "Quantity of waste" should be "COMPLETED"
    And the task "Waste codes and description" should be "COMPLETED"
    Then I complete Exporter details with valid postcode
    And the "who is the importer" page is displayed
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    Then I complete Importer contact details page
    And I click the button Save and continue
    Then the task "Exporter details" should be "COMPLETED"
    Then the task "Importer details" should be "COMPLETED"
    And I click the "Collection date" link
    And I complete the Journey of a waste section
    Then I click the "Recovery facility" link
    And I complete Treatment of waste section
    Then the task "Recovery facility" should be "COMPLETED"
    And I click the "Check your report" link
    Then the "check your report" page is displayed
    When I click waste code Change link
    Then the "Change waste code" page is displayed
    And I click "Back" link should display "check your report" page
