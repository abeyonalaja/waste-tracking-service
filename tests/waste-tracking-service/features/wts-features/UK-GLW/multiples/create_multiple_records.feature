@ignore
Feature: Create multiple records
  AS A Waste Practitioner
  I NEED to be able to upload multiple Annex VII records
  SO THAT I can save time in creating records to accompany any waste movement

  @translation @single
  Scenario: User navigates to How to create multiple Annex records section and verify page is translated
    Given I login to waste tracking portal
    When Export waste from UK page is displayed
    And I click the "How to create a multiple Annex VII record CSV template" link
    Then I should see multi Annex guidance page is display

  @csv_helper @ignore
    #defect need to be fixed
  Scenario: User can see glw csv bounceback page
    Given I login to waste tracking portal
    When Export waste from UK page is displayed
    And I click the "Create multiple Annex VII records" link
    Then I should see glw csv helper page is displayed


