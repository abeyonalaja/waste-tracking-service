@UKMV @accessibility
Feature: Automation to check accessibility tool

  Scenario: Check WTS Accessibility - Service home page
    Given I login into UKWM app
    When the "Service Home" page is displayed
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility - Create Multiple Waste page
    Given I login into UKWM app
    When the "Service Home" page is displayed
    And I click Create a new multiple waste movement link
    Then the "Ukwm Create Multiple Waste" page is displayed
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility - Bulk upload error page
    Given I login into UKWM app
    When the "Service Home" page is displayed
    And I click Create a new multiple waste movement link
    Then the "Ukwm Create Multiple Waste" page is displayed
    And I upload ukwm "UKM_Producer_errors" csv
    And I click the upload button
    When I wait for the error page to load
    Then Bulk upload ukwm error is displayed for "27" records
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility - Bulk upload success page
    Given I login into UKWM app
    When the "Service Home" page is displayed
    And I click Create a new multiple waste movement link
    Then the "Ukwm Create Multiple Waste" page is displayed
    And I upload ukwm "UKWM_correct_40_rows_with_estimate" csv
    And I click the upload button
    When I wait for the upload to finish
    Then Bulk upload success page is displayed for "40" records
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility - Bulk confirmation page
    Given I login into UKWM app
    When the "Service Home" page is displayed
    And I click Create a new multiple waste movement link
    Then the "Ukwm Create Multiple Waste" page is displayed
    And I upload ukwm "UKWM_correct_40_rows_with_estimate" csv
    And I click the upload button
    When I wait for the upload to finish
    Then Bulk upload success page is displayed for "40" records
    And I click Continue and create button
    When I wait for the submission to finish
    Then Bulk confirmation page is displayed for "40" movements
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility - Ukwm cancel page
    Given I login into UKWM app
    When the "Service Home" page is displayed
    And I click Create a new multiple waste movement link
    Then the "Ukwm Create Multiple Waste" page is displayed
    And I upload ukwm "UKWM_correct_40_rows_with_estimate" csv
    And I click the upload button
    When I wait for the upload to finish
    Then Bulk upload success page is displayed for "40" records
    And I click Cancel submission button
    Then the "Ukwm Cancel" page is displayed
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility - Waste movement records list page
    Given I login into UKWM app
    When the "Service Home" page is displayed
    And I click Create a new multiple waste movement link
    Then the "Ukwm Create Multiple Waste" page is displayed
    And I upload ukwm "UKWM_correct_40_rows_with_estimate" csv
    And I click the upload button
    When I wait for the upload to finish
    Then Bulk upload success page is displayed for "40" records
    And I click Continue and create button
    When I wait for the submission to finish
    Then Bulk confirmation page is displayed for "40" movements
    When I click the "view all these created waste movement records" link
    And I switch to new tab
    Then Waste movement records list page
    And I click show all sections
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check WTS Accessibility - Single Record page
    Given I login into UKWM app
    When the "Service Home" page is displayed
    And I click Create a new multiple waste movement link
    Then the "Ukwm Create Multiple Waste" page is displayed
    And I upload ukwm "UKWM_correct_1_row_with_estimate" csv
    And I click the upload button
    When I wait for the upload to finish
    Then Bulk upload success page is displayed for one record
    And I click Continue and create button
    When I wait for the submission to finish
    Then Bulk confirmation page is displayed for one movement record
    When I click the "view all these created waste movement records" link
    And I switch to new tab
    Then Waste movement records list page
    And I click the "View" link
    Then the "Ukwm Single Record" page is displayed
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check UKW Accessibility - Add reference page page
    Given I login into UKWM app
    When the "UKWM Home" page is displayed
    And I click the "Create a new waste movement" link
    Then the "Ukwm Add Reference" page is displayed
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check UKW Accessibility - What's producer address page
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Producer organisation address" link
    Then the "Whats producer address" page is displayed
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check UKW Accessibility - No address found page
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Producer organisation address" link
    Then the "Whats producer address" page is displayed
    And I enter postcode with 0 addresses
    And I click search postcode button
    Then the "No address found" page is displayed
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label


  Scenario: Check UKW Accessibility - Select producer address page
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Producer organisation address" link
    Then the "Whats producer address" page is displayed
    And I enter valid producer postcode
    And I click search postcode button
    Then the "Select producer address" page is displayed
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check UKW Accessibility - Confirm producer address page
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Producer organisation address" link
    Then the "Whats producer address" page is displayed
    And I enter valid producer postcode
    And I click search postcode button
    Then the "Select producer address" page is displayed
    And I select first producer address
    Then the "Confirm producer address" page is displayed
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check UKW Accessibility - Producer contact details page
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Producer organisation contact details" link
    Then the "Producer contact details" page is displayed
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check UKW Accessibility - Source of waste page
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Source of the waste" link
    Then the "Source of the waste" page is displayed
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check UKW Accessibility - Whats Waste Collection Address page
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Waste collection details" link
    Then the "Whats Waste Collection Address" page is displayed
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label

  Scenario: Check UKW Accessibility - Select Waste Collection Address page
    Given I navigate to waste tracking accounts page
    When I navigate to the UKM task list page with reference
    And I click the "Waste collection details" link
    Then the "Whats Waste Collection Address" page is displayed
    And I enter valid waste collection address postcode
    And I click search postcode button
    Then the "Select Waste Collection Address" page is displayed
    Then the page should be axe clean within "main"; excluding "aside"
    Then the page should be axe clean according to: wcag2aa; checking: color-contrast
    Then the page should be axe clean within "main, header" but excluding "footer"
    Then the page should be axe clean checking only: document-title, label
