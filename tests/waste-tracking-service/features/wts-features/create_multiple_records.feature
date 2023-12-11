Feature:AS A Waste Practitioner
  I NEED to be able to upload multiple Annex VII records
  SO THAT I can save time in creating records to accompany any waste movement

  @translation
  Scenario: User navigates to How to create multiple Annex records section and verify page is translated
    Given I login to waste tracking portal
    When I navigate to the overview page
    When Export waste from UK page is displayed
    And I click the "How to create a multiple Annex VII record CSV template" link
    Then the "Create multiple records" page is displayed
    Then I verify create multiple records page is correctly translated




