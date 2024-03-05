@ignore @glw_multiple
Feature: GLW multiple
  AS A Waste Practitioner
  I NEED to be able to upload multiple Annex VII records
  SO THAT I can save time in creating records to accompany any waste movement

  @ignore
    #need to update this after end to end integration
#  Scenario: User can't upload non-csv format file
#    Given I login to waste tracking portal
#    And I navigate to upload glw csv
#    When I upload valid glw csv

  Scenario: User can't continue from glw upload page without uploading a CSV
    Given I login to waste tracking portal
    And I navigate to upload glw csv
    When I click the upload button
    Then I remain on the Create Multiple Records page with an "Upload a CSV file" error message displayed

  Scenario: User can navigate to glw declaration page and click back button
    Given I login to waste tracking portal
    And I navigate to upload glw csv
    When I upload valid glw csv
    And I click the upload button
    Then I should see glw csv is successfully uploaded
    And I should see glw csv upload page correctly translated
    When I wait for a second
    When I click the "Continue and submit all records" button
    Then I should see glw csv declaration page is displayed
    And I should see glw csv declaration page is correctly translated
    And I click "Back" link should display "glw upload success" page

    #end2end
  Scenario: User can navigate to glw confirmation page when a correct CSV is uploaded
    Given I login to waste tracking portal
    And I navigate to upload glw csv
    When I upload valid glw csv
    And I click the upload button
    Then I should see glw csv is successfully uploaded
    And I should see glw csv upload page correctly translated
    When I wait for a second
    When I click the "Continue and submit all records" button
    Then I should see glw csv declaration page is displayed
    When I click the "I confirm - submit all records" button
    Then I should see glw csv submitted successful page
    And I should see glw csv submitted successful page is correctly translated

    #need to fix this after API int
  Scenario: User should see error page when upload csv with incorrect data
    Given I login to waste tracking portal
    And I navigate to upload glw csv
    When I upload invalid glw csv
    And I click the upload button
    Then I should see glw csv error page is displayed
    Then I should see glw csv error page is displayed with 21 errors
    And I should see glw csv error page correctly translated
    And I should see glw csv error page with 4 errors
    And I should see glw error details for 4 errors

  Scenario: User can upload csv from the error details page
    Given I login to waste tracking portal
    And I navigate to upload glw csv
    When I upload invalid glw csv
    And I click the upload button
    Then I should see glw csv error page is displayed
    When I upload valid glw csv
    And I click the upload button
    Then I should see glw csv is successfully uploaded with no errors

  Scenario: User can't continue from glw correct page without uploading a CSV
    Given I login to waste tracking portal
    And I navigate to upload glw csv
    When I upload invalid glw csv
    And I click the upload button
    Then I should see glw csv error page is displayed
    And I click the upload button
    Then I remain on the Glw upload error page with an "Upload a CSV file" error message displayed

  Scenario: User can navigate to review guidance page from glw csv error details page
    Given I login to waste tracking portal
    And I navigate to upload glw csv
    When I upload invalid glw csv
    And I click the upload button
    Then I should see glw csv error page is displayed
    When I navigate to glw csv error row 1
    Then I should see glw csv guidance page link

  Scenario: User can cancel glw csv uploaded records
    Given I login to waste tracking portal
    And I navigate to upload glw csv
    When I upload valid glw csv
    And I click the upload button
    Then I should see glw csv is successfully uploaded
    When I click the "Cancel" link
    Then I should see cancel glw csv upload page is displayed
    And I should see cancel glw csv upload page is correctly translated
    Then I click "Back" link should display "Glw Upload Success" page
    When I click the "Cancel" link
    And I click the "Confirm and cancel" button
    Then I should see "Create multiple records" page is displayed



    #need to check error detail with BE validation for some CSVs



