And(/^I verify waste collection address page is translated correctly$/) do
  WhatsWasteCollectionAddressPage.new.check_page_translation
end

And(/^I enter valid waste collection address postcode$/) do
  WhatsProducerAddressPage.new.enter_postcode 'AL3 8QE'
end

And(/^I verify select waste collection address page is correctly translated$/) do
  SelectWasteCollectionAddressPage.new.check_page_translation
end

And(/^I select first waste collection address$/) do
  SelectProducerAddressPage.new.select_first_address
end

And(/^I should see confirm waste collection address page translated$/) do
  ConfirmWasteCollectionAddressPage.new.check_page_translation
end

And(/^I should see confirm waste collection address page displayed$/) do
  ConfirmWasteCollectionAddressPage.new.check_page_displayed
end

And(/^I enter valid waste collection address postcode and building number$/) do
  WhatsProducerAddressPage.new.enter_postcode 'cv56np'
  WhatsProducerAddressPage.new.enter_building_number '14'
end

And(/^I should see the waste collection address matching the postcode and building number$/) do
  expect(ConfirmWasteCollectionAddressPage.new.address_line_one).to eq '14'
  expect(ConfirmWasteCollectionAddressPage.new.address_line_two).to eq 'Spencer Avenue'
  expect(ConfirmWasteCollectionAddressPage.new.address_line_three).to eq 'Coventry'
  expect(ConfirmWasteCollectionAddressPage.new.address_line_four).to eq 'CV5 6NP'
  expect(ConfirmWasteCollectionAddressPage.new.address_line_five).to eq 'England'
end

Then(/^I should see Do you want to use producer address as waste collection page is displayed$/) do
  DoYouWantToUseProducerAddressPage.new.check_page_displayed
end

And(/^I should see Producer address correctly displayed on Do you want to use producer address as waste collection page is displayed$/) do
  expect(DoYouWantToUseProducerAddressPage.new.full_address).to eq TestStatus.test_status(:producer_full_address)
end

And(/^I should see Waste collection address correctly displayed on confirm waste collection address page is displayed$/) do
  expect(ConfirmWasteCollectionAddressPage.new.full_address).to eq TestStatus.test_status(:producer_full_address)
end

And(/^I verify collection address manual entry page is translated correctly$/) do
  EnterWasteCollectionAddressManualPage.new.check_page_translation
end

And(/^I should see Do you want to use producer address as waste collection page is translated correctly$/) do
  DoYouWantToUseProducerAddressPage.new.check_page_translation
end

Then(/^I complete the Enter waste collection Address Manual page$/) do
  page = 'waste_collection_manual_address_page'
  EnterProducerAddressManualPage.new.enter_building_name_number page
  EnterProducerAddressManualPage.new.enter_address_1 page
  EnterProducerAddressManualPage.new.enter_address_2 page
  EnterProducerAddressManualPage.new.enter_town_and_city page
  EnterProducerAddressManualPage.new.enter_postcode page
  EnterProducerAddressManualPage.new.choose_option 'England'
  TestStatus.set_test_status("#{page}_country".to_sym, 'England')
end

And(/^I should see waste collection address correctly displayed on confirm waste collection address page$/) do
  expect(ConfirmProducerAddressPage.new.address_line_building_name).to eq TestStatus.test_status(:waste_collection_manual_address_page_building_name_number) + ','
  expect(ConfirmProducerAddressPage.new.address_line_one).to eq TestStatus.test_status(:waste_collection_manual_address_page_address_line_1)
  expect(ConfirmProducerAddressPage.new.address_line_two).to eq TestStatus.test_status(:waste_collection_manual_address_page_address_line_2)
  expect(ConfirmProducerAddressPage.new.address_line_three).to eq TestStatus.test_status(:waste_collection_manual_address_page_town_and_city)
  expect(ConfirmProducerAddressPage.new.address_line_four).to eq TestStatus.test_status(:waste_collection_manual_address_page_postcode)
  expect(ConfirmProducerAddressPage.new.address_line_five).to eq TestStatus.test_status(:waste_collection_manual_address_page_country)
end

And(/^I should see previously entered waste collection address pre\-populated$/) do
  expect(EditWasteCollectionAddressPage.new.address_line_building).to eq TestStatus.test_status(:waste_collection_manual_address_page_building_name_number)
  expect(EditWasteCollectionAddressPage.new.address_line_1).to eq TestStatus.test_status(:waste_collection_manual_address_page_address_line_1)
  expect(EditWasteCollectionAddressPage.new.address_line_2).to eq TestStatus.test_status(:waste_collection_manual_address_page_address_line_2)
  expect(EditWasteCollectionAddressPage.new.address_town_city).to eq TestStatus.test_status(:waste_collection_manual_address_page_town_and_city)
  expect(EditWasteCollectionAddressPage.new.address_postcode).to eq TestStatus.test_status(:waste_collection_manual_address_page_postcode)
  expect(EditWasteCollectionAddressPage.new.option_checked?(TestStatus.test_status(:waste_collection_manual_address_page_country))).to eq(true)
end

When(/^I update the waste collection country address to "([^"]*)"$/) do |country|
  page = 'waste_collection_manual_address_page'
  EditWasteCollectionAddressPage.new.choose_option country
  TestStatus.set_test_status("#{page}_country".to_sym, country)
end

When(/^I clear city and town input field$/) do
  EditWasteCollectionAddressPage.new.clear_town_and_city
end

And(/^I enter values which exceed the allowed number of characters for the address fields$/) do
  page = 'waste_collection_manual_address_page'
  random =  Faker::Lorem.characters(number: 251)
  puts '&&&&&&&&'
  puts random
  EnterProducerAddressManualPage.new.enter_building_name_number page,random
  EnterProducerAddressManualPage.new.enter_address_1 page,random
  EnterProducerAddressManualPage.new.enter_address_2 page,random
  EnterProducerAddressManualPage.new.enter_town_and_city page,random
  EnterProducerAddressManualPage.new.enter_postcode page ,'29***123)(*)(*'
end
