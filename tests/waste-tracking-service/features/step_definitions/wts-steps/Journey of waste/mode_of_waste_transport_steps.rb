And(/^I enter shipping container number$/) do
  container_number = 'ABCD1234567'
  ShippingContainerDetailsPage.new.enter_container_number container_number
  TestStatus.set_test_status(:waste_carrier_transport, 'Shipping container')
  TestStatus.set_test_status(:shipping_container, container_number)
end

And(/^I enter vehicle registration number$/) do
  trailer_number = 'CU57ABC'
  TrailerDetailsPage.new.enter_vehicle_number trailer_number
  TestStatus.set_test_status(:waste_carrier_transport, 'Trailer')
  TestStatus.set_test_status(:trailer_number, trailer_number)
end

And(/^I enter IMO number$/) do
  imo_number = '123456789'
  BulkVesselDetailsPage.new.enter_imo_number imo_number
  TestStatus.set_test_status(:waste_carrier_transport, 'Bulk vessel')
  TestStatus.set_test_status(:Bulk_IMO, imo_number)
end

And(/^I should see How will the waste carrier transport the waste page translated$/) do
  HowWillTheWasteCarrierTransportTheWastePage.new.check_translation
end

And(/^I should see Shipping container page translated$/) do
  ShippingContainerDetailsPage.new.check_translation
end

And(/^I should see Trailer page translated$/) do
  TrailerDetailsPage.new.check_translation
end

And(/^I should see Bulk vessel page translated$/) do
  BulkVesselDetailsPage.new.check_translation
end

Then(/^I should see "([^"]*)" to be checked$/) do |name|
  expect(HowWillTheWasteCarrierTransportTheWastePage.new.option_checked?(name)).to eq(true)
end
