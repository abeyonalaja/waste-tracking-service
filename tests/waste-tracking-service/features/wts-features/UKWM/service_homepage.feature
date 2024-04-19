@UKMV @ignore
Feature: AS A Waste Controller
  I NEED to create a new multiple UK waste movement
  SO THAT a digital waste record can be created for the movement and tracking of waste

  @translation
  Scenario: User navigates to Service homepage and create multiple records page and verifies they are translated
    Given I login into UKWM app
    When the "Service Home" page is displayed
    Then I should see service home page correctly translated
    And I click Create a new multiple waste movement link
    Then the "Create Multiple Waste" page is displayed
    And I verify create multiple waste page is correctly translated

  Scenario: User navigates to Service homepage and click Home breadcrumb
    Given I login into UKWM app
    When the "Service Home" page is displayed
    Then I should see service home page correctly translated
    And I click HOME breadcrumb
    Then the "Waste Tracking Landing" page is displayed
