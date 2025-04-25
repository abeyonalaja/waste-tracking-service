Feature:Shutter page feature
  I NEED a message displayed when WTS is not accessible
  SO THAT I know the reason I can’t access the service

  Scenario: User verifies shutter page 404 content
    Given I login to waste tracking portal with link which leads to shutter page "404"
    Then I see Shutter '404' page correctly translated

    @ignore #defect-427137
  Scenario: User verifies shutter page 500 content
    Given I login to waste tracking portal with link which leads to shutter page "500"
    Then I see Shutter '500' page correctly translated

