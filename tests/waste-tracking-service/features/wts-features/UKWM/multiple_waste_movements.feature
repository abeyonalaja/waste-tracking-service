@UKMV @ignore
Feature: AS A Waste Controller
  I NEED to be able to upload multiple waste movements
  SO THAT I can save time in creating waste records to accompany any UK waste movement

  Scenario: User navigates to create multiple records page and click guidance link
    Given I login into UKWM app
    When the "Service Home" page is displayed
    And I click Create a new multiple waste movement link
    Then the "Ukwm Create Multiple Waste" page is displayed
    And I click on guidance link
    Then the "Ukwm User Guidance" page is displayed
    And I verify guidance page is translated correctly

  Scenario: User navigates to create multiple records page and click back button
    Given I login into UKWM app
    When the "Service Home" page is displayed
    And I click Create a new multiple waste movement link
    Then the "Ukwm Create Multiple Waste" page is displayed
    And I click browser back button
    Then the "Service Home" page is displayed

  # need discussion with FE about manipulating the cookie
  Scenario: User navigates to interruption page and verify its correctly translated
    Given I login into UKWM app
    When the "Service Home" page is displayed
    And I click Create a new multiple waste movement link
    Then the "Ukwm Interruption" page is displayed
    And I verify interruption page is correctly translated
    And I click Continue button
    Then the "Ukwm Create Multiple Waste" page is displayed

  # need discussion with FE about manipulating the cookie
  Scenario: User navigates to user guidance page using the interuption page
    Given I login into UKWM app
    When the "Service Home" page is displayed
    And I click Create a new multiple waste movement link
    Then the "Ukwm Interruption" page is displayed
    And I click on guidance link
    Then the "Ukwm User Guidance" page is displayed

  Scenario: User navigates to create multiple waste page and click upload
    Given I login into ukwm FE mock gateway app
    When the "Service Home" page is displayed
    And I click Create a new multiple waste movement link
    Then the "Ukwm Interruption" page is displayed
    And I click Continue button
    Then the "Ukwm Create Multiple Waste" page is displayed
    And I click the upload button
    Then I remain on the Ukwm Create Multiple Waste page with an "Upload a CSV file" error message displayed
