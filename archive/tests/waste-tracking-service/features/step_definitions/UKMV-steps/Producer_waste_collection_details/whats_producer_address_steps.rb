And(/^I verify whats producer address page is correctly translated$/) do
  WhatsProducerAddressPage.new.check_page_translation
end

And(/^I enter valid producer postcode$/) do
  WhatsProducerAddressPage.new.enter_postcode 'AL3 8QE'
end

And(/^I verify select producer address page is correctly translated$/) do
  SelectProducerAddressPage.new.check_page_translation
end

And(/^I enter postcode with 0 addresses$/) do
  WhatsProducerAddressPage.new.enter_postcode 'n1p3bp'
end

And(/^I verify no address found page is correctly translated$/) do
  NoAddressFoundPage.new.check_page_translation
end

And(/^I verify manual entry page is translated correctly$/) do
  EnterProducerAddressManualPage.new.check_page_translation
end

Then(/^I complete the Enter Producer Address Manual page$/) do
  page = 'producer_manual_address_page'
  EnterProducerAddressManualPage.new.enter_building_name_number page
  EnterProducerAddressManualPage.new.enter_address_1 page
  EnterProducerAddressManualPage.new.enter_address_2 page
  EnterProducerAddressManualPage.new.enter_town_and_city page
  EnterProducerAddressManualPage.new.enter_postcode page
  EnterProducerAddressManualPage.new.choose_option 'England'
  TestStatus.set_test_status("#{page}_country".to_sym, 'England')
end

And(/^I select first producer address$/) do
  SelectProducerAddressPage.new.select_first_address 'producer'
  SelectProducerAddressPage.new.save_and_continue
end

And(/^I should see confirm producer address page translated$/) do
  ConfirmProducerAddressPage.new.check_page_translation
end

And(/^I should see selected address displayed correctly$/) do
  expect(ConfirmProducerAddressPage.new.address_line_one).to eq 'Ashlyn'
  expect(ConfirmProducerAddressPage.new.address_line_two).to eq 'Luton Road, Markyate'
  expect(ConfirmProducerAddressPage.new.address_line_three).to eq 'St. Albans'
  expect(ConfirmProducerAddressPage.new.address_line_four).to eq 'AL3 8QE'
  expect(ConfirmProducerAddressPage.new.address_line_five).to eq 'England'
end

And(/^I enter valid producer postcode and building number$/) do
  WhatsProducerAddressPage.new.enter_postcode 'cv56np'
  WhatsProducerAddressPage.new.enter_building_number '14'
end

And(/^I should see the address matching the postcode and building number$/) do
  expect(ConfirmProducerAddressPage.new.address_line_one).to eq '14'
  expect(ConfirmProducerAddressPage.new.address_line_two).to eq 'Spencer Avenue'
  expect(ConfirmProducerAddressPage.new.address_line_three).to eq 'Coventry'
  expect(ConfirmProducerAddressPage.new.address_line_four).to eq 'CV5 6NP'
  expect(ConfirmProducerAddressPage.new.address_line_five).to eq 'England'
end

And(/^I select second producer address$/) do
  SelectProducerAddressPage.new.select_second_address 'producer'
end

And(/^I enter invalid address postcode$/) do
  WhatsProducerAddressPage.new.enter_postcode 'AL3 '
end
