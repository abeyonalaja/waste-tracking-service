And(/^I should see Waste collection details page correctly translated$/) do
  WasteCollectionDetailsPage.new.check_page_displayed
  WasteCollectionDetailsPage.new.check_translation
end

And(/^I chose first option from the dropdown list$/) do
  WasteCollectionDetailsPage.new.select_first_address
end

Then(/^I should see selected address displayed with Change address link on the page$/) do
  # expect(WasteCollectionDetailsPage.new).to have_address TestStatus.test_status(:exporter_address)
  expect(page).to have_link('Change address')
end

And(/^I can see previously entered postcode pre\-populated$/) do
  WasteCollectionDetailsPage.new.has_postcode? TestStatus.test_status(:postcode)
end

And(/^I complete the Contact details collection page$/) do
  ContactDetailsCollectionAddressPage.new.enter_organisation_name 'TestOrg LTD'
  ContactDetailsCollectionAddressPage.new.enter_full_name 'John Johnson'
  ContactDetailsCollectionAddressPage.new.enter_email 'emial@mail.com'
  ContactDetailsCollectionAddressPage.new.enter_phone_number '+441234567891'
end

And(/^I should see previously entered details pre\-populated$/) do
  expect(ContactDetailsCollectionAddressPage.new).to have_reference_organisation_name TestStatus.test_status(:organisation_name)
  expect(ContactDetailsCollectionAddressPage.new).to have_reference_full_name TestStatus.test_status(:full_name)
  expect(ContactDetailsCollectionAddressPage.new).to have_reference_email TestStatus.test_status(:email)
  expect(ContactDetailsCollectionAddressPage.new).to have_reference_phone_number TestStatus.test_status(:phone_number)
end
