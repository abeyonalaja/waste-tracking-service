And(/^I should see Waste collection address page correctly translated$/) do
  WasteCollectionAddressPage.new.check_page_displayed
  WasteCollectionAddressPage.new.check_translation
  WasteCollectionAddressPage.new.check_postcode_translation
end

Then(/^I should see selected address displayed with Change address link on the page$/) do
  expect(WasteCollectionAddressPage.new).to have_address TestStatus.test_status(:waste_collection_address)
end

And(/^I can see previously entered postcode pre\-populated$/) do
  WasteCollectionAddressPage.new.has_postcode? TestStatus.test_status(:postcode)
end

And(/^I complete the Contact details collection page$/) do
  ContactDetailsCollectionAddressPage.new.enter_organisation_name 'TestOrg LTD'
  ContactDetailsCollectionAddressPage.new.enter_full_name 'John Johnson'
  ContactDetailsCollectionAddressPage.new.enter_email 'emial@mail.com'
  ContactDetailsCollectionAddressPage.new.enter_phone_number '+44 12345 6789(12-34)12'
end

And(/^I should see previously entered waste collection details pre-populated$/) do
  expect(ContactDetailsCollectionAddressPage.new).to have_reference_organisation_name TestStatus.test_status(:waste_contact_organisation_name)
  expect(ContactDetailsCollectionAddressPage.new).to have_reference_full_name TestStatus.test_status(:waste_contact_full_name)
  expect(ContactDetailsCollectionAddressPage.new).to have_reference_email TestStatus.test_status(:waste_contact_email)
  expect(ContactDetailsCollectionAddressPage.new).to have_reference_phone_number TestStatus.test_status(:waste_contact_phone_number)
end

And(/^I complete waste carrier location and collection details$/) do
  WasteCollectionDetailsController.complete
end

And(/^I choose first collection address from the list$/) do
  WasteCollectionAddressPage.new.choose_first_address
end

And(/^I should see check the collection address page correctly translated$/) do
  CheckTheCollectionAddressPage.new.check_page_translation
end

And(/^I complete the Contact details collection page with incorrect phone number$/) do
  ContactDetailsCollectionAddressPage.new.enter_organisation_name 'TestOrg LTD'
  ContactDetailsCollectionAddressPage.new.enter_full_name 'John Johnson'
  ContactDetailsCollectionAddressPage.new.enter_email 'emial@mail.com'
  ContactDetailsCollectionAddressPage.new.enter_phone_number '+44 12345 6789(12-34)123'
end
