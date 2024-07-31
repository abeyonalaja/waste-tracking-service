@UKMV @ignore
Feature: AS A Waste controller
  I NEED to be able to add a waste producer organisation address detail manually
  SO THAT I have the address where the waste is coming from captured on the system

  @translation
  Scenario: User navigates to Enter Producer Address Manual page, verify its correctly translated
    Given I login into UKWM app
    When I navigate to the UKWM task list page with reference
    And I click the "Producer organisation address" link
    Then the "Whats producer address" page is displayed
    And I click the "Or enter the address manually" link
    Then the "Enter Producer Address Manual" page is displayed
    And I verify manual entry page is translated correctly
    Then I complete the Enter Producer Address Manual page
    And I click the button Save and continue
    Then the "Producer Contact Details" page is displayed



