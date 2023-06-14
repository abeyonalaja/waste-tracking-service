Feature: AS A waste producer/broker
  I NEED to be able to add recovery facility details
  SO THAT if there is a need for the waste to be returned it can be moved to the recovery facility

  @translation
  Scenario: Check recovery facility address, contact and recovery page displayed correctly
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    #temp page
    And I click the Recovery facilities page link
    Then I should see recovery facility address page correctly translated
    And I complete recovery facility address page
    Then I should see recovery facility contact details page correctly translated
    When I complete recovery facility contact details
    Then I should see recovery code page correctly translated


  Scenario: User complete recovery facility address, contact and view details on Recovery facility details page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    #temp page
    And I click the Recovery facilities page link
    Then the "Recovery facility address" page is displayed
    And I complete recovery facility address page
    Then the "Recovery facility contact details" page is displayed
    When I complete recovery facility contact details
    Then the "Recovery code" page is displayed
    When I select first recovery code from the recovery facility
#    Then the "Recovery List" page is displayed
#    Then I should recovery list page is displayed with all the recovery details
    And I click "Back" link should display "submit an export" page

  Scenario: User can't continue without completing facility address details
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    #temp page
    And I click the Recovery facilities page link
    And I click the button Save and continue
    Then I remain on the recovery facility address page with an "Enter the recovery facility name" error message displayed
    And I remain on the recovery facility address page with an "Enter a country" error message displayed
    And I remain on the recovery facility address page with an "Enter an address" error message displayed
    When I click the Save and return to draft
    Then I remain on the recovery facility address page with an "Enter the recovery facility name" error message displayed
    And I remain on the recovery facility address page with an "Enter a country" error message displayed
    And I remain on the recovery facility address page with an "Enter an address" error message displayed


  Scenario: User can't continue without completing facility contact details
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    #temp page
    And I click the Recovery facilities page link
    And I complete recovery facility address page
    And I click the button Save and continue
    Then I remain on the recovery facility contact details page with an "Enter a full name" error message displayed
    And I remain on the recovery facility contact details page with an "Enter a real email address" error message displayed
    And I remain on the recovery facility contact details page with an "Enter a real phone number" error message displayed
    When I click the Save and return to draft
    Then I remain on the recovery facility contact details page with an "Enter a full name" error message displayed
    And I remain on the recovery facility contact details page with an "Enter a real email address" error message displayed
    And I remain on the recovery facility contact details page with an "Enter a real phone number" error message displayed

  Scenario: User can't continue without recovery code page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    #temp page
    And I click the Recovery facilities page link
    When I complete recovery facility address page
    And I click the button Save and continue
    When I complete recovery facility contact details
    And I click the button Save and continue
    Then I remain on the recovery code page with an "Enter a recovery code" error message displayed
    When I click the Save and return to draft
    Then I remain on the recovery code page with an "Enter a recovery code" error message displayed
  ##defect user need to navigate
  Scenario: User can save and return to draft from recovery address page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    #temp page
    And I click the Recovery facilities page link
    And I complete recovery facility address page
    And I click the Save and return to draft
    Then the task "Recovery facility" should be "IN PROGRESS"
    When I click the "Recovery facility" link
    And I click the Recovery facilities page link
    Then the "Recovery facility address" page is displayed


