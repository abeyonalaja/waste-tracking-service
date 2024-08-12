And(/^I should see Producer address correctly displayed on confirm producer address page$/) do
  expect(ConfirmProducerAddressPage.new.address_line_building_name).to eq TestStatus.test_status(:producer_manual_address_page_building_name_number) + ','
  expect(ConfirmProducerAddressPage.new.address_line_one).to eq TestStatus.test_status(:producer_manual_address_page_address_line_1)
  expect(ConfirmProducerAddressPage.new.address_line_two).to eq TestStatus.test_status(:producer_manual_address_page_address_line_2)
  expect(ConfirmProducerAddressPage.new.address_line_three).to eq TestStatus.test_status(:producer_manual_address_page_town_and_city)
  expect(ConfirmProducerAddressPage.new.address_line_four).to eq TestStatus.test_status(:producer_manual_address_page_postcode)
  expect(ConfirmProducerAddressPage.new.address_line_five).to eq TestStatus.test_status(:producer_manual_address_page_country)
end

And(/^I should see previously entered producer address pre\-populated$/) do
  expect(EditProducerAddressPage.new.address_line_building).to eq TestStatus.test_status(:producer_manual_address_page_building_name_number)
  expect(EditProducerAddressPage.new.address_line_1).to eq TestStatus.test_status(:producer_manual_address_page_address_line_1)
  expect(EditProducerAddressPage.new.address_line_2).to eq TestStatus.test_status(:producer_manual_address_page_address_line_2)
  expect(EditProducerAddressPage.new.address_town_city).to eq TestStatus.test_status(:producer_manual_address_page_town_and_city)
  expect(EditProducerAddressPage.new.address_postcode).to eq TestStatus.test_status(:producer_manual_address_page_postcode)
  expect(EditProducerAddressPage.new.option_checked?(TestStatus.test_status(:producer_manual_address_page_country))).to eq(true)
end

When(/^I update the producer country address to "([^"]*)"$/) do |country|
  page = 'producer_manual_address_page'
  EnterProducerAddressManualPage.new.choose_option country
  TestStatus.set_test_status("#{page}_country".to_sym, country)
end
