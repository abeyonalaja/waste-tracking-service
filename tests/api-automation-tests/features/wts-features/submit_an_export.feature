Feature:AS A Waste Producer/Broker
  I NEED to submit an Annex 7 form
  SO THAT my waste can be processed for export

  Scenario: Submit and export default status codes
    Given I POST reference number "API Testing" for waste export
    Then I should default task status in the response

    Scenario: Update the reference number for the existing export
      Given I POST reference number "API Testing" for waste export
      Then reference number should be successfully created
      When I amend the reference number to "Amend reference" for waste export
      Then  reference number should be successfully updated

