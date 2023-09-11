@add_national_code
Feature:AS A Waste Producer/Broker
  I NEED to submit an Annex 7 form
  SO THAT my waste can be processed for export

  Scenario: Add a national code and verify if it is saved
    Given I login to waste tracking portal
    Then I navigate to National Code page
    Then I verify copy text is present on the page
    And I have selected Yes and entered valid national code
    When I click the button Save and continue
    Then I verify Describe waste page is displayed
    And I click browser back button
    Then I verify Yes option is selected
    And I should see national code pre-populated

  Scenario: Validate error on entering invalid text
    Given I login to waste tracking portal
    Then I navigate to National Code page
    And I have selected Yes and entered in-valid national code
    And I click the button Save and continue
    Then I remain on the National code page with an "The code must only include letters a to z, numbers, spaces, hyphens and back slashes" error message displayed

  Scenario: Select No option on national code page
    Given I login to waste tracking portal
    Then I navigate to National Code page
    And I have selected "No" option
    And I click the button Save and continue
    Then I verify Describe waste page is displayed

  Scenario: Without selecting any option move to Describe waste page
    Given I login to waste tracking portal
    Then I navigate to National Code page
    And I click the button Save and continue
    Then I verify Describe waste page is displayed

  Scenario: Back function clicked
    Given I login to waste tracking portal
    When I navigate to National Code page
    And I click browser back button
    Then I should see ewc code description on EWC list page
