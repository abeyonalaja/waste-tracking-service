@accessibility @ignore
Feature: Automation to check accessibility tool


  Scenario: Check WTS Accessibility for Overview page
    Given I login to waste tracking portal
    And I click the "Green list waste overview" link
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for submit an export page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean within "#exporter-details"; according to: best-practice
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean excluding "#exporter-details" according to: wcag2a, wcag2aa but skipping: color-contrast
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list


  Scenario: Check WTS Accessibility for - Waste code page
    Given I login to waste tracking portal
    And I navigate to whats the waste code page
    When I choose "Basel Annex IX" as a waste code
#    Then the page should be axe clean
#    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
#    Then the page should be axe clean according to ruleset: wcag2
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean excluding "#exporter-details" according to: wcag2a, wcag2aa but skipping: color-contrast
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - EWC code page with option YES
    Given I login to waste tracking portal
    When I navigate to Add EWC code page
    And I have selected "Yes" option
    Then the page should be axe clean according to: wcag2a


  Scenario: Check WTS Accessibility for - EWC code page with option YES
    Given I login to waste tracking portal
    When I navigate to Add EWC code page
    And I have selected "Yes" option
    Then the page should be axe clean according to: wcag2a

  Scenario: Check WTS Accessibility for - EWC code list page
    Given I login to waste tracking portal
    When I navigate to Add EWC code page
    And I have selected "Yes" option
    And I have selected valid ewc code
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a

  Scenario: Check WTS Accessibility for -National code page
    Given I login to waste tracking portal
    Then I navigate to National Code page
    When I choose "Yes" radio button
    Then the page should be axe clean according to: wcag2a

  Scenario: Check WTS Accessibility for -Describe the waste page
    Given I login to waste tracking portal
    And I navigate on the Describe the waste
    When I click the button Save and continue
    Then the page should be axe clean according to: wcag2a

  Scenario: Check WTS Accessibility for - net weight or volume of the waste
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Quantity of waste" link
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a


  Scenario: Check WTS Accessibility for - actual net weight or volume of the waste
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Quantity of waste" link
    And I choose "Yes, I know the actual amount" radio button
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list


  Scenario: Check WTS Accessibility for - Exporter details page, postcode finder
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I navigate to Exporter details page with valid postcode
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Exporter details page, Manual entry page
    Given I login to waste tracking portal
    When I navigate to Enter exporter address manual page
    When I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Exporter details page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I navigate to Exporter details page with valid postcode
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list


  Scenario: Check WTS Accessibility for - Who's the importer page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Importer details" link
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Who's the importer page - error validation
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Importer details" link
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Importer details page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Importer details" link
    And I complete who is the importer page
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Importer details page - error validation
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Importer details" link
    And I complete who is the importer page
    And I click the button Save and continue
    Then the "Importer contact details" page is displayed
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list


  Scenario: Check WTS Accessibility for - Collection date page - Yes option
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Collection date" link
    Then the "collection date" page is displayed
    And I choose "Yes, I’ll enter the actual date" radio button
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Collection date page - No option
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Collection date" link
    Then the "collection date" page is displayed
    And I choose "No, I’ll enter an estimate date" radio button
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Collection date page - error validation
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Collection date" link
    Then the "collection date" page is displayed
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Who is the waste carrier page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Who is the waste carrier page - error validation
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    Then the "who is the waste carrier" page is displayed
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list


  Scenario: Check WTS Accessibility for - Waste carrier contact details page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    Then the "who is the waste carrier" page is displayed
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list


  Scenario: Check WTS Accessibility for - Waste carrier contact details page - error validation
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    Then the "who is the waste carrier" page is displayed
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    Then I should see "what are the waste carriers contact details" page is displayed
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - How will the waste carrier transport the waste page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I complete the Whats is the waste carriers contact details page
    And I click the button Save and continue
    And I choose "Shipping container" radio button
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - How will the waste carrier transport the waste page - error validation
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I complete the Whats is the waste carriers contact details page
    And I click the button Save and continue
    Then I should see "how will the waste carrier transport the waste" page is displayed
    And I click Continue button
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Shipping container page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I complete the Whats is the waste carriers contact details page
    And I click the button Save and continue
    And I choose "Shipping container" radio button
    And I click Continue button
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Shipping container page - error validation
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I complete the Whats is the waste carriers contact details page
    And I click the button Save and continue
    And I choose "Shipping container" radio button
    And I click Continue button
    Then the "Shipping container details" page is displayed
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Trailer page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I complete the Whats is the waste carriers contact details page
    And I click the button Save and continue
    And I choose "Trailer" radio button
    And I click Continue button
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Trailer page - error validation
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I complete the Whats is the waste carriers contact details page
    And I click the button Save and continue
    And I choose "Trailer" radio button
    And I click Continue button
    Then the "Trailer details" page is displayed
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Bulk vessel page - error validation
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I complete the Whats is the waste carriers contact details page
    And I click the button Save and continue
    And I choose "Bulk vessel" radio button
    And I click Continue button
    Then the "Bulk vessel" page is displayed
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Bulk vessel page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    And I complete the Who is the waste carrier page
    And I click the button Save and continue
    And I complete the Whats is the waste carriers contact details page
    And I click the button Save and continue
    And I choose "Bulk vessel" radio button
    And I click Continue button
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Your added carriers page - Yes option
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    And I complete the "first" waste carrier with "Shipping container"
    And I choose "Yes" radio button
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Your added carriers page - No option
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Waste carriers" link
    And I complete the "first" waste carrier with "Shipping container"
    And I choose "No" radio button
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Waste collection details postcode page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    When I click the "Waste collection details" link
    Then the "Waste collection details" page is displayed
    When I enter valid postcode
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Waste collection details postcode page - with address
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    When I click the "Waste collection details" link
    Then the "Waste collection details" page is displayed
    When I enter valid postcode
    And I click Find Address button
    And I chose first option from the dropdown list
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - contact details for collection address page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    When I click the "Waste collection details" link
    Then the "Waste collection details" page is displayed
    When I enter valid postcode
    And I click Find Address button
    And I chose first option from the dropdown list
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Enter address manually page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    When I click the "Waste collection details" link
    Then the "Waste collection details" page is displayed
    And I click the "Enter address manually" link
    And I choose "England" radio button
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Enter address manually page - error validation
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    When I click the "Waste collection details" link
    Then the "Waste collection details" page is displayed
    And I click the "Enter address manually" link
    Then I should see "Manual Address Entry Waste Collection" page is displayed
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Location waste leaves UK page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Location waste leaves the UK" link
    Then the "Location waste leaves the UK" page is displayed
    And I choose "Yes" radio button
    And I enter location
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Location waste leaves UK page - error validation
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Location waste leaves the UK" link
    Then the "Location waste leaves the UK" page is displayed
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Countries waste will travel through
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Countries waste will travel through" link
    And I choose "Yes" radio button
    When I select other countries of waste
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Countries waste will travel through - error validation
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Countries waste will travel through" link
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Countries waste will travel through list page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Countries waste will travel through" link
    And I choose "Yes" radio button
    When I select other countries of waste
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list


  Scenario: Check WTS Accessibility for - Confirmation interim site page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility for - Recovery facility address page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "No" radio button
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Recovery facility address page - error validation
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "No" radio button
    And I click the button Save and continue
    Then the "Recovery facility address" page is displayed
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Recovery facility contact details page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "No" radio button
    And I click the button Save and continue
    And I complete recovery facility address page
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - Recovery facility contact details page - error validation
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "No" radio button
    And I click the button Save and continue
    And I complete recovery facility address page
    And I click the button Save and continue
    Then the "Recovery facility contact details" page is displayed
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - recovery code page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "No" radio button
    And I click the button Save and continue
    Then the "Recovery facility address" page is displayed
    When I complete recovery facility address page
    And I click the button Save and continue
    Then the "Recovery facility contact details" page is displayed
    When I complete recovery facility contact details
    And I click the button Save and continue
    Then the "Recovery code" page is displayed
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - chosen facilities page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "No" radio button
    And I click the button Save and continue
    Then the "Recovery facility address" page is displayed
    When I complete recovery facility address page
    And I click the button Save and continue
    Then the "Recovery facility contact details" page is displayed
    When I complete recovery facility contact details
    And I click the button Save and continue
    Then the "Recovery code" page is displayed
    When I select first recovery code from the recovery facility
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - interim site address page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - interim site address page - error validation
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then the "Interim site address" page is displayed
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list


  Scenario: Check WTS Accessibility for - interim site contact details page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then the "Interim site address" page is displayed
    And I complete the Interim site address page
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - interim site contact details page - error validation
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then the "Interim site address" page is displayed
    And I complete the Interim site address page
    And I click the button Save and continue
    Then the "Interim site contact details" page is displayed
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list


  Scenario: Check WTS Accessibility for - interim site recovery code page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then the "Interim site address" page is displayed
    And I complete the Interim site address page
    And I click the button Save and continue
    Then the "Interim site contact details" page is displayed
    And I complete Interim site contact details page
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list

  Scenario: Check WTS Accessibility for - interim site recovery code page - error validation
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "Yes" radio button
    And I click the button Save and continue
    Then the "Interim site address" page is displayed
    And I complete the Interim site address page
    And I click the button Save and continue
    Then the "Interim site contact details" page is displayed
    And I complete Interim site contact details page
    And I click the button Save and continue
    Then  the "Interim site recovery code" page is displayed
    And I click the button Save and continue
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list
