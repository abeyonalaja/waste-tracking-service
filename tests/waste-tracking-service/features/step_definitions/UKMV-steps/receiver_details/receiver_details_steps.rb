
And(/^I verify whats Receiver address page is correctly translated$/) do
  WhatsReceiverAddressPage.new.check_page_translation
end

And(/^I enter valid Receiver postcode$/) do
  WhatsReceiverAddressPage.new.enter_postcode 'AL3 8QE'
end

And(/^I select first Receiver address$/) do
  SelectReceiverAddressPage.new.select_first_address 'carrier'
end

And(/^I should see confirm Receiver address page translated$/) do
  ConfirmReceiverAddressPage.new.check_page_translation
end

And(/^I should see selected receiver address displayed correctly$/) do
  expect(ConfirmReceiverAddressPage.new.address_line_one).to eq 'Ashlyn'
  expect(ConfirmReceiverAddressPage.new.address_line_two).to eq 'Luton Road, Markyate'
  expect(ConfirmReceiverAddressPage.new.address_line_three).to eq 'St. Albans'
  expect(ConfirmReceiverAddressPage.new.address_line_four).to eq 'AL3 8QE'
  expect(ConfirmReceiverAddressPage.new.address_line_five).to eq 'England'
end

And(/^I enter valid Receiver postcode and building number$/) do
  WhatsReceiverAddressPage.new.enter_postcode 'cv56np'
  WhatsReceiverAddressPage.new.enter_building_number '14'
end

And(/^I select second Receiver address$/) do
  SelectReceiverAddressPage.new.select_second_address 'carrier'
end

And(/^I verify Receiver address manual entry page is translated correctly$/) do
  EnterReceiverAddressManualPage.new.check_page_translation
end

Then(/^I complete the Enter Receiver Address Manual page$/) do
  page = 'receiver_manual_address_page'
  EnterReceiverAddressManualPage.new.enter_building_name_number page
  EnterReceiverAddressManualPage.new.enter_address_1 page
  EnterReceiverAddressManualPage.new.enter_address_2 page
  EnterReceiverAddressManualPage.new.enter_town_and_city page
  EnterReceiverAddressManualPage.new.enter_postcode page
  EnterReceiverAddressManualPage.new.choose_option 'England'
  TestStatus.set_test_status(:receiver_manual_address_page_country, 'England')
end

And(/^I should see Receiver address correctly displayed on confirm Receiver address page$/) do
  expect(ConfirmReceiverAddressPage.new.address_line_one).to eq TestStatus.test_status(:receiver_manual_address_page_address_line_1)
  expect(ConfirmReceiverAddressPage.new.address_line_building_name).to eq TestStatus.test_status(:receiver_manual_address_page_building_name_number) + ','
  expect(ConfirmReceiverAddressPage.new.address_line_two).to eq TestStatus.test_status(:receiver_manual_address_page_address_line_2)
  expect(ConfirmReceiverAddressPage.new.address_line_three).to eq TestStatus.test_status(:receiver_manual_address_page_town_and_city)
  expect(ConfirmReceiverAddressPage.new.address_line_four).to eq TestStatus.test_status(:receiver_manual_address_page_postcode)
  expect(ConfirmReceiverAddressPage.new.address_line_five).to eq TestStatus.test_status(:receiver_manual_address_page_country)
end

And(/^I should see previously entered Receiver address pre\-populated$/) do
  expect(EditReceiverAddressPage.new.address_line_building).to eq TestStatus.test_status(:receiver_manual_address_page_building_name_number)
  expect(EditReceiverAddressPage.new.address_line_1).to eq TestStatus.test_status(:receiver_manual_address_page_address_line_1)
  expect(EditReceiverAddressPage.new.address_line_2).to eq TestStatus.test_status(:receiver_manual_address_page_address_line_2)
  expect(EditReceiverAddressPage.new.address_town_city).to eq TestStatus.test_status(:receiver_manual_address_page_town_and_city)
  expect(EditReceiverAddressPage.new.address_postcode).to eq TestStatus.test_status(:receiver_manual_address_page_postcode)
  expect(EditReceiverAddressPage.new.option_checked?(TestStatus.test_status(:receiver_manual_address_page_country))).to eq(true)
end

When(/^I update the Receiver country address to "([^"]*)"$/) do |country|
  page = 'receiver_manual_address_page'
  EnterReceiverAddressManualPage.new.choose_option country
  TestStatus.set_test_status("#{page}_country".to_sym, country)
end

And(/^I verify select Receiver address page is correctly translated$/) do
  SelectReceiverAddressPage.new.check_page_translation
end
