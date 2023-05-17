And(/^I should see Who is the importer page translated$/) do
  WhoIsTheImporterPage.new.check_page_displayed
  WhoIsTheImporterPage.new.check_translation
end

And(/^I should see What are the importers contact details page translated$/) do
  ImporterContactDetailsPage.new.check_page_displayed
  ImporterContactDetailsPage.new.check_translation
end

And(/^I complete who is the importer page$/) do
  WhoIsTheImporterPage.new.enter_organisation_name 'DefraUK'
  WhoIsTheImporterPage.new.enter_address 'Address,1 street'
  WhoIsTheImporterPage.new.enter_country 'England'
end

And(/^I complete Importer contact details page$/) do
  ImporterContactDetailsPage.new.enter_organisation_contact 'John Arnold'
  ImporterContactDetailsPage.new.enter_email 'mail@mail.com'
  ImporterContactDetailsPage.new.enter_phone_number '+441234567891'
  ImporterContactDetailsPage.new.enter_fax_number '123Fax'
end

Then(/^I verify that previously entered details are pre\-populated$/) do
  expect(WhoIsTheImporterPage.new).to have_reference_organisation_name TestStatus.test_status(:organisation_name)
  expect(WhoIsTheImporterPage.new).to have_reference_address TestStatus.test_status(:address)
  expect(WhoIsTheImporterPage.new).to have_reference_country TestStatus.test_status(:country)
end

Then(/^I verify that previously entered details are pre\-populated on the Importer contact details page$/) do
  expect(ImporterContactDetailsPage.new).to have_reference_organisation_contact TestStatus.test_status(:organisation_contact)
  expect(ImporterContactDetailsPage.new).to have_reference_email TestStatus.test_status(:email)
  expect(ImporterContactDetailsPage.new).to have_reference_phone_number TestStatus.test_status(:phone_number)
  expect(ImporterContactDetailsPage.new).to have_reference_fax_number TestStatus.test_status(:fax_number)
end
