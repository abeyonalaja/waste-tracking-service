@UKMV @ignore
Feature: AS A Waste Controller
  I NEED to be able to submit feedback on the UKWM service
  SO THAT I can convey my level of satisfaction with using the service

  @translation
  Scenario: User navigates to ukwm feedback and verifies its translated correctly
    Given I login into UKWM app
    When the "Service Home" page is displayed
    Then I click the "feedback" link
    When the "Ukwm Feedback Survey" page is displayed
    And I verify ukwm feedback page is translated correctly

  Scenario: User submit feedback about ukwm service
    Given I login into UKWM app
    When the "Service Home" page is displayed
    Then I click the "feedback" link
    When the "Ukwm Feedback Survey" page is displayed
    And I choose "Satisfied" radio button
    And I enter feedback description
    And I click send feedback button
    Then I see success banner displayed
    And I click the Go back to the page you were looking at link
    Then the "Service Home" page is displayed

  Scenario: User submit empty feedback about ukwm service
    Given I login into UKWM app
    When the "Service Home" page is displayed
    Then I click the "feedback" link
    When the "Ukwm Feedback Survey" page is displayed
    And I click send feedback button
    Then the "Service Home" page is displayed

  Scenario: User submit feedback and return to the page he was before
    Given I login into UKWM app
    When the "Service Home" page is displayed
    And I click Create a new multiple waste movement link
    Then the "Ukwm Interruption" page is displayed
    Then I click the "feedback" link
    When the "Ukwm Feedback Survey" page is displayed
    And I choose "Satisfied" radio button
    And I enter feedback description
    And I click send feedback button
    Then I see success banner displayed
    And I click the Go back to the page you were looking at link
    Then the "Ukwm Interruption" page is displayed
