@glw_multiple
Feature: GLW multiple
  AS A Waste Practitioner
  I NEED to be able to upload multiple Annex VII records
  SO THAT I can save time in creating records to accompany any waste movement

  @ignore
    #need to update this after end to end integration
  Scenario: User can't upload non-csv format file
    Given I login to waste tracking portal
    And I navigate to upload glw csv
    When I upload valid glw csv

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
    Then I should see glw csv error page with error details
    And I should see glw error details are correctly displayed

