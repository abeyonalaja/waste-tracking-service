And(/^I complete the Who is the waste carrier page$/) do
  WhoIsTheWasteCarrierPage.new.enter_organisation_name 'WTS Organisation'
  WhoIsTheWasteCarrierPage.new.enter_address 'wtsOrg1@mail.com'
  WhoIsTheWasteCarrierPage.new.enter_country 'England'
end

And(/^I complete the Whats is the waste carriers contact details page$/) do
  WhatAreTheWasteCarriersContactDetailsPage.new.enter_organisation_contact 'John Arnold'
  WhatAreTheWasteCarriersContactDetailsPage.new.enter_email 'mail@mail.net'
  WhatAreTheWasteCarriersContactDetailsPage.new.enter_phone_number '+441234567891'
  WhatAreTheWasteCarriersContactDetailsPage.new.enter_fax_number '123Fax'
end

And(/^I see already entered details pre\-populated$/) do
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

Then(/^I see Waste carrier details entered previously pre\-populated$/) do
  expect(WhatAreTheWasteCarriersContactDetailsPage.new).to have_reference_organisation_contact TestStatus.test_status(:organisation_contact)
  expect(WhatAreTheWasteCarriersContactDetailsPage.new).to have_reference_email TestStatus.test_status(:email)
  expect(WhatAreTheWasteCarriersContactDetailsPage.new).to have_reference_phone_number TestStatus.test_status(:phone_number)
  expect(WhatAreTheWasteCarriersContactDetailsPage.new).to have_reference_fax_number TestStatus.test_status(:fax_number)
end
