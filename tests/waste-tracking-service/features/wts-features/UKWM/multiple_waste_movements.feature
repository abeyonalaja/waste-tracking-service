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
    Given I login into UKWM app
    When the "Service Home" page is displayed
    And I click Create a new multiple waste movement link
    Then the "Ukwm Create Multiple Waste" page is displayed
    And I click the upload button
    Then I remain on the Ukwm Create Multiple Waste page with an "Upload a CSV file" error message displayed

  Scenario: Check UKM CSV error page and translation
    Given I login into UKWM app
    When the "Service Home" page is displayed
    And I click Create a new multiple waste movement link
    Then the "Ukwm Create Multiple Waste" page is displayed
    And I upload ukwm "UKM_Producer_errors" csv
    And I click the upload button
    When I wait for the error page to load
    Then Bulk upload ukwm error is displayed for "27" records
    Then I see ukwm summary page correctly translated

  Scenario: User upload invalid ukwm csv and verify error messages in the column table
    Given I login into UKWM app
    When the "Service Home" page is displayed
    And I click Create a new multiple waste movement link
    Then the "Ukwm Create Multiple Waste" page is displayed
    And I upload ukwm "UKM_Producer_errors" csv
    And I click the upload button
    When I wait for the error page to load
    Then Bulk upload ukwm error is displayed for "27" records
    And I should see 11 column error details correctly displayed for "UKM_Producer_errors" csv
    Then I should see column error details correctly displayed for "UKM_Producer_errors" csv
    When I click UKM errors by rows
    Then I should see row error details correctly displayed for "UKM_Producer_errors"

  Scenario: User navigates to upload success page by uploading valid ukwm csv
    Given I login into UKWM app
    When the "Service Home" page is displayed
    And I click Create a new multiple waste movement link
    Then the "Ukwm Create Multiple Waste" page is displayed
    And I upload ukwm "UKWM_correct_40_rows_with_estimate" csv
    And I click the upload button
    When I wait for the upload to finish
    Then Bulk upload success page is displayed for "40" records
    And I verify Bulk upload success page is correctly translated for "40" records

  Scenario: User navigates to bulk confirmation page by uploading valid ukwm csv
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
    And I click return Return to move waste in the UK button
    Then the "Service Home" page is displayed

  Scenario: User cancel ukwm multiples submission
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
    And I verify cancel page is translated correctly
    And I click confirm and cancel button
    Then the "Ukwm Create Multiple Waste" page is displayed

  Scenario: User click Continue to crete records on Cancel page
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
    And I verify cancel page is translated correctly
    And I click continue to create records
    When I wait for the submission to finish
    Then Bulk confirmation page is displayed for "40" movements

  Scenario: User navigates to view all waste movement records page from submission page
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
    And I can see the header columns on the UKM list page correctly displayed
    And I can view all the 40 records in 3 pagination pages




