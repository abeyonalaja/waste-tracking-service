Feature: AS A waste producer/broker
  I NEED to sign the declaration for the export details
  SO THAT I can submit the completed export form

  @translation
  Scenario: Check sign declaration page after choosing Bulk waste
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
    And I click the "Check your record" link
    Then the "check your report" page is displayed
    And I click Confirm all answers button
    Then the "sign declaration" page is displayed
    And I can see page translated correctly for bulk waste
    And I click confirm and submit button
    Then Export submitted page displayed
    When I navigate to the export PDF
    Then I should see pdf header details correctly loaded
    And I should see section 1 exporter details correctly displayed
    And I should see section 2 importer details correctly displayed
    And I should see section 3 actual quantity details correctly displayed
    And I should see section 4 actual collection date correctly displayed
    And I should see section 5 first waste carrier details correctly displayed
    And I should see section 6 waste generate details correctly displayed
    And I should see section 7 recovery facility details correctly displayed
    And I should see section interim site details correctly displayed
    And I should see section 8 bulk waste recovery details correctly displayed
    And I should see section 9 waste description details correctly displayed
    And I should see section 10 waste identification details correctly displayed
    And I should see section 11 countries details correctly displayed

  @translation
  Scenario: Check sign declaration page after choosing Actual Small waste and Actual collection waste
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
    And I click the "Check your record" link
    Then the "check your report" page is displayed
    And I click Confirm all answers button
    Then the "sign declaration" page is displayed
    And I can see page translated correctly for small waste
    And I click confirm and submit button
    Then Export submitted page displayed
    When I navigate to the export PDF
    Then I should see pdf header details correctly loaded
    And I should see section 1 exporter details correctly displayed
    And I should see section 2 importer details correctly displayed
    And I should see section 3 actual quantity details correctly displayed
    And I should see section 4 actual collection date correctly displayed
    And I should see section 5 first waste carrier details correctly displayed
    And I should see section 6 waste generate details correctly displayed
    And I should see section 7 laboratory details correctly displayed
    And I should see section 8 small waste recovery details correctly displayed
    And I should see section 9 waste description details correctly displayed
    And I should see section 10 waste identification details correctly displayed
    And I should see section 11 countries details correctly displayed
