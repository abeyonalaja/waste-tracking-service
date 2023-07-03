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


  Scenario: Check WTS Accessibility for - Whos the importer page
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Importer details" link
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list


  Scenario: Check WTS Accessibility for - waste carriers journey
    Given I login to waste tracking portal
    When I navigate to the submit an export with reference
    And I click the "Importer details" link
    Then the page should be axe clean according to: wcag2a; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
    Then the page should be axe clean according to: best-practice and checking: aria-roles, definition-list





