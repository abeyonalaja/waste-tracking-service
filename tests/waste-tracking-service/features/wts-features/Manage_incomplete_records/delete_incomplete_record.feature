Feature: AS A waste practitioner
  I NEED to be able to delete a draft export
  SO THAT I can remove export that is no longer required

  Scenario: User deletes incomplete record and verifies that is not present on the Incomplete records page
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    Then Submit an export page is displayed
    And I navigate to Quantity of waste page
    When I complete Quantity of waste with estimated bulk waste
    Then the "submit an export" page is displayed
    And I click Export waste from UK breadcrumb
    Then the "Export waste from uk" page is displayed
    And I click the "Manage incomplete Annex VII records" link
    Then the "Draft records" page is displayed
    And I click delete link for the first record on the page
    Then the "Confirmation delete annex record" page is displayed
    And I verify reference caption is present
    And I choose "Yes" radio button
    And I click confirm button
    Then the "Draft records" page is displayed
    And I verify that correct success message is displayed
    And I verify record is not present on the page

  Scenario: User deletes incomplete record without reference and verifies correct success message is displayed
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    Then Submit an export page is displayed
    And I navigate to Quantity of waste page
    When I complete Quantity of waste with estimated bulk waste
    Then the "submit an export" page is displayed
    And I click Move export or import waste breadcrumb
    And I navigate to the submit an export with reference
    Then Submit an export page is displayed
    And I navigate to Quantity of waste page
    When I complete Quantity of waste with estimated bulk waste
    Then the "submit an export" page is displayed
    And I click Export waste from UK breadcrumb
    Then the "Export waste from uk" page is displayed
    And I click the "Manage incomplete Annex VII records" link
    Then the "Draft records" page is displayed
    And I click delete link for the first record on the page
    Then the "Confirmation delete annex record" page is displayed
    And I choose "Yes" radio button
    And I click confirm button
    Then the "Draft records" page is displayed
    And I verify success message does not contain reference number
    And I verify record is not present on the page

  Scenario: User select No option on Delete confirmation page and verifies record is not deleted
    Given I login to waste tracking portal
    And I navigate to the submit an export with reference
    Then Submit an export page is displayed
    And I navigate to Quantity of waste page
    When I complete Quantity of waste with estimated bulk waste
    Then the "submit an export" page is displayed
    And I click Export waste from UK breadcrumb
    Then the "Export waste from uk" page is displayed
    And I click the "Manage incomplete Annex VII records" link
    Then the "Draft records" page is displayed
    And I click delete link for the first record on the page
    Then the "Confirmation delete annex record" page is displayed
    And I verify reference caption is present
    And I choose "No" radio button
    And I click confirm button
    Then the "Draft records" page is displayed
    And I verify record is present on the page






