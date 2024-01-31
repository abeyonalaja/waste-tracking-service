And(/^I complete the Who is the waste carrier page$/) do
  sleep 1
  WhoIsTheWasteCarrierPage.new.enter_organisation_name 'WTS Organisation'
  WhoIsTheWasteCarrierPage.new.enter_address 'wtsOrg1@mail.com'
  WhoIsTheWasteCarrierPage.new.enter_country 'England'
end

And(/^I complete the Whats is the waste carriers contact details page$/) do
  WhatAreTheWasteCarriersContactDetailsPage.new.enter_organisation_contact 'John Arnold'
  WhatAreTheWasteCarriersContactDetailsPage.new.enter_email 'mail@mail.net'
  WhatAreTheWasteCarriersContactDetailsPage.new.enter_phone_number '+441234567891'
  WhatAreTheWasteCarriersContactDetailsPage.new.enter_fax_number '12345678910'
end

And(/^I see previously entered waste carrier details pre-populated$/) do
  expect(WhoIsTheWasteCarrierPage.new).to have_reference_organisation_name TestStatus.test_status(:organisation_name)
  expect(WhoIsTheWasteCarrierPage.new).to have_reference_address TestStatus.test_status(:address)
  expect(WhoIsTheWasteCarrierPage.new).to have_reference_country TestStatus.test_status(:country)
end

And(/^I should see Who is the waste carrier page translated$/) do
  WhoIsTheWasteCarrierPage.new.check_translation
end

And(/^I should see Whats is the waste carriers contact details page translated$/) do
  WhatAreTheWasteCarriersContactDetailsPage.new.check_translation
end

Then(/^I see previously entered Waste carrier contact details pre-populated$/) do
  expect(WhatAreTheWasteCarriersContactDetailsPage.new).to have_reference_organisation_contact TestStatus.test_status(:organisation_contact)
  expect(WhatAreTheWasteCarriersContactDetailsPage.new).to have_reference_email TestStatus.test_status(:email)
  expect(WhatAreTheWasteCarriersContactDetailsPage.new).to have_reference_phone_number TestStatus.test_status(:phone_number)
  expect(WhatAreTheWasteCarriersContactDetailsPage.new).to have_reference_fax_number TestStatus.test_status(:fax_number)
end

When(/^I update first waste carrier Organisation name details$/) do
  new_organisation_name = 'first WTS Organisation'
  WhoIsTheWasteCarrierPage.new.enter_organisation_name new_organisation_name
  WhoIsTheWasteCarrierPage.new.enter_address 'wtsOrg1@mail.com'
  WhoIsTheWasteCarrierPage.new.enter_country 'England'
  TestStatus.waste_carrier_org_details new_organisation_name
end

Then(/^the who is the second waste carriers page is displayed$/) do
  WhoIsTheWasteCarrierPage.new.check_second_waste_page_displayed
end

And(/^I complete waste carrier detail with (\d+) waste carrier$/) do |no_of_waste_carrier|
  WasteCarrierBulkWasteController.complete no_of_waste_carrier
end

And(/^I enter not valid fax number$/) do
  WhoIsTheWasteCarrierPage.new.enter_invalid_fax_number
end

And(/^I enter not valid international fax number$/) do
  WhoIsTheWasteCarrierPage.new.enter_invalid_int_fax_number ''
  WhoIsTheWasteCarrierPage.new.enter_invalid_int_fax_number '+123456789123654789123'
end
