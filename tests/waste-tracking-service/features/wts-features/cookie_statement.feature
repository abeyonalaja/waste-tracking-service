Feature:AS A Waste Practitioner
  I NEED to see the WT service cookie banner on accessing the service
  SO THAT I know what cookies are been tracked while using the service

  @translation
  Scenario: User click View cookies link and verifies Cookies page is translated
    Given I login to waste tracking portal
    Then I verify Cookie banner is displayed
    And I click the "View cookies" link
    Then the "View cookies" page is displayed
    And I verify Cookies page is correctly translated

  Scenario: User accept the cookies and verify change option is working
    Given I login to waste tracking portal
    And I verify Cookie banner is displayed
    When I click Accept analytics cookies button
    Then Message for accepted cookies is displayed
    And I click the "change your cookie settings" link
    Then the "View cookies" page is displayed

  Scenario: User reject the cookies and verify change option is working
    Given I login to waste tracking portal
    And I verify Cookie banner is displayed
    When I click Reject analytics cookies button
    Then Message for rejected cookies is displayed
    And I click the "change your cookie settings" link
    Then the "View cookies" page is displayed

  Scenario: User click Hide cookie banner button
    Given I login to waste tracking portal
    And I verify Cookie banner is displayed
    When I click Reject analytics cookies button
    Then Message for rejected cookies is displayed
    And I click Hide cookies message button
    Then I verify Cookie banner is not visible
