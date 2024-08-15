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
