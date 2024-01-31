@glw_multiple
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
    Then I remain on the Create Multiple Records page with an "Select a file to upload" error message displayed

  Scenario: User can successfully upload GLW CSV
    Given I login to waste tracking portal
    And I navigate to upload glw csv
    When I upload valid glw csv
    And I click the upload button
    Then I should see glw csv is successfully uploaded

  Scenario: User should see error page when upload csv with incorrect data
    Given I login to waste tracking portal
    And I navigate to upload glw csv
    When I upload invalid glw csv
    And I click the upload button
    Then I should see glw csv error page is displayed
    Then I should see glw csv error page is displayed with 4 errors
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
    Then I remain on the Glw upload error page with an "Select a file to upload" error message displayed

    Scenario: User can navigate to review guidance page from glw csv error details page
      Given I login to waste tracking portal
      And I navigate to upload glw csv
      When I upload invalid glw csv
      And I click the upload button
      Then I should see glw csv error page is displayed
      When I navigate to glw csv error row 1
      Then I should see glw csv guidance page link



    #need to check error detail with BE validation for some CSVs



