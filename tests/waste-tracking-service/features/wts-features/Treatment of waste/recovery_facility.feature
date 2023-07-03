Feature: AS A waste producer/broker
  I NEED to be able to add recovery facility details
  SO THAT if there is a need for the waste to be returned it can be moved to the recovery facility

  @translation
  Scenario: Check recovery facility address, contact and recovery page displayed correctly
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "No" radio button
    And I click the button Save and continue
    Then the "Recovery facility address" page is displayed
    Then I should see recovery facility address page correctly translated
    When I complete recovery facility address page
    And I click the button Save and continue
    Then I should see recovery facility contact details page correctly translated
    When I complete recovery facility contact details
    And I click the button Save and continue
    Then I should see recovery code page correctly translated
    When I select first recovery code from the recovery facility
    When I click the button Save and continue
    Then I should see chosen facility page correctly translated
    And I should see first recovery facility details

  Scenario: User complete recovery facility address, contact and view details on Recovery facility details page
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
    Then the "chosen facilities" page is displayed
    Then I should first recovery title is displayed with only change link
    And I click "Back" link should display "Recovery code" page

  Scenario: User can't continue without completing facility address details
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "No" radio button
    And I click the button Save and continue
    And I wait for a second
    Then the "Recovery facility address" page is displayed
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
    Then the "Confirmation Interim Site" page is displayed
    And I choose "No" radio button
    And I click the button Save and continue
    Then the "Recovery facility address" page is displayed
    And I complete recovery facility address page
    And I click the button Save and continue
    And I wait for a second
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
    Then the "Confirmation Interim Site" page is displayed
    And I choose "No" radio button
    And I click the button Save and continue
    Then the "Recovery facility address" page is displayed
    When I complete recovery facility address page
    And I click the button Save and continue
    When I complete recovery facility contact details
    And I click the button Save and continue
    And I wait for a second
    And I click the button Save and continue
    Then I remain on the recovery code page with an "Enter a recovery code" error message displayed
    When I click the Save and return to draft
    Then I remain on the recovery code page with an "Enter a recovery code" error message displayed

  Scenario: User can save and return to draft from recovery address page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "No" radio button
    And I click the button Save and continue
    Then the "Recovery facility address" page is displayed
    And I complete recovery facility address page
    And I click the Save and return to draft
    Then the task "Recovery facility" should be "IN PROGRESS"
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I click the button Save and continue
    Then the "Recovery facility address" page is displayed
    And I should see previously entered recovery facility details pre-populated

  @translation
  Scenario: User can add upto 2 recovery facilities
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "No" radio button
    And I click the button Save and continue
    Then the "Recovery facility address" page is displayed
    And I complete the "first" recovery facility
    And I choose "Yes" radio button
    And I click the button Save and continue
    And I complete the "second" recovery facility
    Then I should see max recovery facility text correctly translated
    And I should see both change and remove recovery facility
    And I should see first recovery facility details
    And I should see second recovery facility details
    When I click the button Save and continue
    Then the task "Recovery facility" should be "COMPLETED"
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed

  Scenario: User can change previously entered recovery details
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "No" radio button
    And I click the button Save and continue
    Then the "Recovery facility address" page is displayed
    And I complete the "first" recovery facility
    When I click the "Change" link
    Then I should see previously entered recovery facility details pre-populated
    When I update the recovery facility country
    And I click the button Save and continue
    Then I should see previously entered recovery contact details pre-populated
    When I click the button Save and continue
    Then I should see previously entered recovery code details pre-populated
    When I click the button Save and continue
    Then I should see updated recovery country

  Scenario: User can't continue from Remove Recovery facility page and can remove previously entered recovery facility details
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    And I complete Waste codes and description task
    When I click the "Recovery facility" link
    Then the "Confirmation Interim Site" page is displayed
    And I choose "No" radio button
    And I click the button Save and continue
    Then the "Recovery facility address" page is displayed
    And I complete the "first" recovery facility
    And I choose "Yes" radio button
    And I click the button Save and continue
    And I complete the "second" recovery facility
    And I wait for a second
    And I click the last "Remove" link
    Then I should see remove recovery facility details page displayed
    When I click the button Save and continue
    Then I should see "Select yes if you want to remove this recovery facility" error message displayed
    When I choose "No" radio button
    When I click the button Save and continue
    Then I should see first recovery facility details
    And I should see second recovery facility details
    And I wait for a second
    When I click the last "Remove" link
    When I choose "Yes" radio button
    When I click the button Save and continue
    Then the chosen facility page is displayed
    And I should see first recovery facility details

