And(/^I should see Who is the importer page translated$/) do
  WhoIsTheImporterPage.new.check_page_displayed
  WhoIsTheImporterPage.new.check_translation
end

And(/^I should see What are the importers contact details page translated$/) do
  ImporterContactDetailsPage.new.check_page_displayed
  ImporterContactDetailsPage.new.check_translation
end

And(/^I complete who is the importer page$/) do
  org_name = Faker::Company.name.gsub(/\W/, '')
  WhoIsTheImporterPage.new.enter_organisation_name org_name
  TestStatus.set_test_status(:importer_org_name, org_name)
  address = 'Address,1 street'
  WhoIsTheImporterPage.new.enter_address address
  TestStatus.set_test_status(:importer_address, address)
  country = 'England'
  WhoIsTheImporterPage.new.enter_country 'England'
  TestStatus.set_test_status(:importer_country, country)
end

And(/^I complete Importer contact details page$/) do
  ImporterContactDetailsPage.new.enter_organisation_contact 'John Arnold'
  ImporterContactDetailsPage.new.enter_email 'mail@mail.com'
  ImporterContactDetailsPage.new.enter_phone_number '+359-8988-1(434)5'
  ImporterContactDetailsPage.new.enter_fax_number '12345678910'
  TestStatus.set_test_status(:importer_org_contact, 'John Arnold')
  TestStatus.set_test_status(:importer_email, 'mail@mail.com')
  TestStatus.set_test_status(:importer_phone_number, '+359-8988-1(434)5')
  TestStatus.set_test_status(:importer_fax_number, '12345678910')
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

And(/^I enter invalid phone number$/) do
  ImporterContactDetailsPage.new.enter_organisation_contact 'John Arnold'
  ImporterContactDetailsPage.new.enter_email 'mail@mail.com'
  ImporterContactDetailsPage.new.enter_phone_number '+359-8988-1434512345634'
end
