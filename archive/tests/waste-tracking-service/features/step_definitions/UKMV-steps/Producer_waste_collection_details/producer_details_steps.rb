And(/^I should see Producer address correctly displayed on confirm producer address page$/) do
  expect(ConfirmProducerAddressPage.new.address_line_one).to eq TestStatus.test_status(:producer_manual_address_page_address_line_1)
  expect(ConfirmProducerAddressPage.new.address_line_building_name).to eq TestStatus.test_status(:producer_manual_address_page_building_name_number) + ','
  expect(ConfirmProducerAddressPage.new.address_line_two).to eq TestStatus.test_status(:producer_manual_address_page_address_line_2)
  expect(ConfirmProducerAddressPage.new.address_line_three).to eq TestStatus.test_status(:producer_manual_address_page_town_and_city)
  expect(ConfirmProducerAddressPage.new.address_line_four).to eq TestStatus.test_status(:producer_manual_address_page_postcode)
  expect(ConfirmProducerAddressPage.new.address_line_five).to eq TestStatus.test_status(:producer_manual_address_page_country)
end

And(/^I should see previously entered producer address pre\-populated$/) do
  expect(EditProducerAddressPage.new.address_line_building).to eq TestStatus.test_status(:producer_manual_address_page_building_name_number)
  expect(EditProducerAddressPage.new.address_line_1).to eq TestStatus.test_status(:producer_manual_address_page_address_line_1)
  expect(EditProducerAddressPage.new.address_line_2).to eq TestStatus.test_status(:producer_manual_address_page_address_line_2)
  expect(EditProducerAddressPage.new.address_town_city).to eq TestStatus.test_status(:producer_manual_address_page_town_and_city)
  expect(EditProducerAddressPage.new.address_postcode).to eq TestStatus.test_status(:producer_manual_address_page_postcode)
  expect(EditProducerAddressPage.new.option_checked?(TestStatus.test_status(:producer_manual_address_page_country))).to eq(true)
end

When(/^I update the producer country address to "([^"]*)"$/) do |country|
  page = 'producer_manual_address_page'
  EnterProducerAddressManualPage.new.choose_option country
  TestStatus.set_test_status("#{page}_country".to_sym, country)
end

And(/^I verify producer contact details page is correctly translated$/) do
  ProducerContactDetailsPage.new.check_page_translation
end

And(/^I complete the producer contact details page$/) do
  UkmProducerContactDetailsController.complete
end

And(/^I should see previously entered producer contact details pre\-populated$/) do
  expect(ProducerContactDetailsPage.new.organisation_name).to eq TestStatus.test_status(:org_name)
  expect(ProducerContactDetailsPage.new.contact_person).to eq TestStatus.test_status(:contact_person)
  expect(ProducerContactDetailsPage.new.email_address).to eq TestStatus.test_status(:email)
  expect(ProducerContactDetailsPage.new.phone_number).to eq TestStatus.test_status(:phone_number)
end

And(/^I complete the producer contact details page with new entries$/) do
  ProducerContactDetailsPage.new.fill_organisation_name ''
  ProducerContactDetailsPage.new.fill_organisation_contact_person ''
  ProducerContactDetailsPage.new.fill_email_address ''
  ProducerContactDetailsPage.new.fill_phone_number ''
  UkmProducerContactDetailsController.complete
end

And(/^I complete the producer contact details page partially$/) do
  org_name = Faker::Company.name
  contact_person = Faker::Name.name
  ProducerContactDetailsPage.new.fill_organisation_name org_name
  ProducerContactDetailsPage.new.fill_organisation_contact_person contact_person
  TestStatus.set_test_status(:org_name, org_name)
  TestStatus.set_test_status(:contact_person, contact_person)
end

And(/^I should see previously entered partially producer contact details pre\-populated$/) do
  expect(ProducerContactDetailsPage.new.organisation_name).to eq TestStatus.test_status(:org_name)
  expect(ProducerContactDetailsPage.new.contact_person).to eq TestStatus.test_status(:contact_person)
end

And(/^I enter invalid fax number for producer contact details$/) do
  ProducerContactDetailsPage.new.fill_fax_number 'fax123'
end

And(/^I enter values which exceed the allowed number of characters for the fields$/) do
  org_name =  Faker::Lorem.characters(number: 251)
  contact_person = Faker::Lorem.characters(number: 251)
  email = Faker::Lorem.characters(number: 250)
  ProducerContactDetailsPage.new.fill_organisation_name org_name
  ProducerContactDetailsPage.new.fill_organisation_contact_person contact_person
  ProducerContactDetailsPage.new.fill_email_address email + '@test.com'
end

And(/^I complete producer organisation address with postcode search$/) do
  UkmProducerAddressController.complete
end
