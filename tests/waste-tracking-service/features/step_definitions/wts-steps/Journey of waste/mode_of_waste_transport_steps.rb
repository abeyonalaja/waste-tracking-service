And(/^I enter details about the transport$/) do
  transport_description = 'Shipping container-ABC123, vehicle registrations-AB1234, IMO-123456,Freight numbers-AB12ER, trailer numbers-123456,Specialist containers being transported-ABC123,Call signs-XYZ1234567,Container -12345'
  RoadTransportDetailsPage.new.enter_transportation_description transport_description
  TestStatus.set_test_status(:transport_description, transport_description)
end

And(/^I should see How will the waste carrier transport the waste page translated$/) do
  HowWillTheWasteCarrierTransportTheWastePage.new.check_translation
end

And(/^I should see road transport details page translated$/) do
  RoadTransportDetailsPage.new.check_translation
end

And(/^I should see Sea transport details page translated$/) do
  SeaTransportDetailsPage.new.check_translation
end

And(/^I should see Air transport details page translated$/) do
  AirTransportDetailsPage.new.check_translation
end

Then(/^I should see "([^"]*)" to be checked$/) do |name|
  expect(HowWillTheWasteCarrierTransportTheWastePage.new.option_checked?(name)).to eq(true)
end

And(/^I should see Rail transport details page translated$/) do
  RailTransportDetailsPage.new.check_translation
end

And(/^I should see inland waterways transport details page translated$/) do
  InlandWaterTransportDetailsPage.new.check_translation
end

And(/^I enter more than allowed charaters on details about the transport$/) do
  transport_description = 'Shipping container-ABC123, vehicle registrations-AB1234, IMO-123456,Freight numbers-AB12ER, trailer numbers-123456,Specialist containers being transported-ABC123,Call signs-XYZ1234567,Container -12345, Max charater testing'
  RoadTransportDetailsPage.new.enter_transportation_description transport_description
end
