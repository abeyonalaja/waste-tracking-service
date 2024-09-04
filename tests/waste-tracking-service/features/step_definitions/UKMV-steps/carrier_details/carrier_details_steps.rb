And(/^I verify carrier address manual entry page is translated correctly$/) do
  WhatsCarrierAddressPage.new.check_page_translation
end

Then(/^I complete the Enter Carrier Address Manual page$/) do
  page = 'carrier_manual_address_page'
  EnterCarrierAddressManualPage.new.enter_building_name_number page
  EnterCarrierAddressManualPage.new.enter_address_1 page
  EnterCarrierAddressManualPage.new.enter_address_2 page
  EnterCarrierAddressManualPage.new.enter_town_and_city page
  EnterCarrierAddressManualPage.new.enter_postcode page
  EnterCarrierAddressManualPage.new.choose_option 'England'
  TestStatus.set_test_status(:carrier_manual_address_page_country, 'England')
end

And(/^I should see Carrier address correctly displayed on confirm Carrier address page$/) do
  expect(ConfirmCarrierAddressPage.new.address_line_one).to eq TestStatus.test_status(:carrier_manual_address_page_address_line_1)
  expect(ConfirmCarrierAddressPage.new.address_line_building_name).to eq TestStatus.test_status(:carrier_manual_address_page_building_name_number) + ','
  expect(ConfirmCarrierAddressPage.new.address_line_two).to eq TestStatus.test_status(:carrier_manual_address_page_address_line_2)
  expect(ConfirmCarrierAddressPage.new.address_line_three).to eq TestStatus.test_status(:carrier_manual_address_page_town_and_city)
  expect(ConfirmCarrierAddressPage.new.address_line_four).to eq TestStatus.test_status(:carrier_manual_address_page_postcode)
  expect(ConfirmCarrierAddressPage.new.address_line_five).to eq TestStatus.test_status(:carrier_manual_address_page_country)
end

And(/^I should see previously entered Carrier address pre\-populated$/) do
  expect(EditCarrierAddressPage.new.address_line_building).to eq TestStatus.test_status(:carrier_manual_address_page_building_name_number)
  expect(EditCarrierAddressPage.new.address_line_1).to eq TestStatus.test_status(:carrier_manual_address_page_address_line_1)
  expect(EditCarrierAddressPage.new.address_line_2).to eq TestStatus.test_status(:carrier_manual_address_page_address_line_2)
  expect(EditCarrierAddressPage.new.address_town_city).to eq TestStatus.test_status(:carrier_manual_address_page_town_and_city)
  expect(EditCarrierAddressPage.new.address_postcode).to eq TestStatus.test_status(:carrier_manual_address_page_postcode)
  expect(EditCarrierAddressPage.new.option_checked?(TestStatus.test_status(:carrier_manual_address_page_country))).to eq(true)
end

When(/^I update the Carrier country address to "([^"]*)"$/) do |country|
  page = 'carrier_manual_address_page'
  EnterCarrierAddressManualPage.new.choose_option country
  TestStatus.set_test_status("#{page}_country".to_sym, country)
end

And(/^I enter valid Carrier postcode$/) do
  WhatsCarrierAddressPage.new.enter_postcode 'AL3 8QE'
end

And(/^I verify whats Carrier address page is correctly translated$/) do
  WhatsCarrierAddressPage.new.check_page_translation
end

And(/^I should see confirm Carrier address page translated$/) do
  ConfirmCarrierAddressPage.new.check_page_translation
end

And(/^I select first Carrier address$/) do
  SelectCarrierAddressPage.new.select_first_address 'carrier'
end

And(/^I enter valid Carrier postcode and building number$/) do
  WhatsCarrierAddressPage.new.enter_postcode 'cv56np'
  WhatsCarrierAddressPage.new.enter_building_number '14'
end

And(/^I select second Carrier address$/) do
  SelectCarrierAddressPage.new.select_second_address 'carrier'
end

And(/^I verify select Carrier address page is correctly translated$/) do
  SelectCarrierAddressPage.new.check_page_translation
end

And(/^I should see selected carried address displayed correctly$/) do
  expect(ConfirmCarrierAddressPage.new.address_line_one).to eq 'Ashlyn'
  expect(ConfirmCarrierAddressPage.new.address_line_two).to eq 'Luton Road, Markyate'
  expect(ConfirmCarrierAddressPage.new.address_line_three).to eq 'St. Albans'
  expect(ConfirmCarrierAddressPage.new.address_line_four).to eq 'AL3 8QE'
  expect(ConfirmCarrierAddressPage.new.address_line_five).to eq 'England'
end

And(/^I verify Carrier contact details page is correctly translated$/) do
  CarrierContactDetailsPage.new.check_page_translation
end

And(/^I complete the Carrier contact details page$/) do
  UkmCarrierContactDetailsController.complete
end

And(/^I should see previously entered carrier contact details pre\-populated$/) do
  expect(CarrierContactDetailsPage.new.organisation_name).to eq TestStatus.test_status(:org_name)
  expect(CarrierContactDetailsPage.new.contact_person).to eq TestStatus.test_status(:contact_person)
  expect(CarrierContactDetailsPage.new.email_address).to eq TestStatus.test_status(:email)
  expect(CarrierContactDetailsPage.new.phone_number).to eq TestStatus.test_status(:phone_number)
end

And(/^I complete the carrier contact details page with new entries$/) do
  CarrierContactDetailsPage.new.fill_organisation_name ''
  CarrierContactDetailsPage.new.fill_organisation_contact_person ''
  CarrierContactDetailsPage.new.fill_email_address ''
  CarrierContactDetailsPage.new.fill_phone_number ''
  UkmCarrierContactDetailsController.complete
end

And(/^I complete Carrier contact details page partially$/) do
  org_name = Faker::Company.name
  contact_person = Faker::Name.name
  CarrierContactDetailsPage.new.fill_organisation_name org_name
  CarrierContactDetailsPage.new.fill_organisation_contact_person contact_person
  TestStatus.set_test_status(:org_name, org_name)
  TestStatus.set_test_status(:contact_person, contact_person)
end

And(/^I enter invalid fax number for carrier contact details$/) do
  CarrierContactDetailsPage.new.fill_fax_number 'fax123'
end
