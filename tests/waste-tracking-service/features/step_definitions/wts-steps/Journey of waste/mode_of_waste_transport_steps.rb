And(/^I enter shipping container number$/) do
  ShippingContainerDetailsPage.new.enter_container_number 'ABCD1234567'
end

And(/^I enter vehicle registration number$/) do
  TrailerDetailsPage.new.enter_vehicle_number 'CU57ABC'
end

And(/^I enter IMO number$/) do
  BulkVesselDetailsPage.new.enter_imo_number '123456789'
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
