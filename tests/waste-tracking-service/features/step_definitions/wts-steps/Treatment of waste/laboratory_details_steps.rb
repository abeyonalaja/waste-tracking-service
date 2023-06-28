Then(/^I should see laboratory address correctly translated$/) do
  LaboratoryAddressPage.new.check_page_displayed
  LaboratoryAddressPage.new.check_translation
end

When(/^I complete laboratory address details$/) do
  LaboratoryAddressController.complete
end

Then(/^I should see laboratory contact details correctly translated$/) do
  LaboratoryContactDetailsPage.new.check_page_displayed
  LaboratoryContactDetailsPage.new.check_translation
end

When(/^I complete laboratory contact details$/) do
  LaboratoryContactDetailsController.complete
end

Then(/^I should see disposal code page correctly translated$/) do
  DisposalCodePage.new.check_page_displayed
  DisposalCodePage.new.check_translation
end

When(/^I complete disposal code page$/) do
  DisposalCodeController.complete
end

Then(/^I should see previously entered Laboratory address details pre\-populated$/) do
  expect(LaboratoryAddressPage.new).to have_name TestStatus.test_status(:laboratory_address_name)
  expect(LaboratoryAddressPage.new).to have_address TestStatus.test_status(:laboratory_address_address)
  expect(LaboratoryAddressPage.new).to have_country TestStatus.test_status(:laboratory_address_country)
end

Then(/^I should see previously entered laboratory contact details pre\-populated$/) do
  expect(LaboratoryContactDetailsPage.new).to have_full_name TestStatus.test_status(:laboratory_contact_details_full_name)
  expect(LaboratoryContactDetailsPage.new).to have_email TestStatus.test_status(:laboratory_contact_details_email)
  expect(LaboratoryContactDetailsPage.new).to have_phone_number TestStatus.test_status(:laboratory_contact_details_phone_number)
  expect(LaboratoryContactDetailsPage.new).to have_fax TestStatus.test_status(:laboratory_contact_details_fax_number)
end

Then(/^I should see disposal code details pre\-populated$/) do
  expect(DisposalCodePage.new).to have_disposal_code TestStatus.test_status(:laboratory_disposal_code)
end
