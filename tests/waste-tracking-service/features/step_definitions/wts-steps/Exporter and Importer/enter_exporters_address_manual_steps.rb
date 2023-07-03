When(/^I navigate to Enter exporter address manual page$/) do
  click_link('Green list waste overview')
  OverviewPage.new.submit_a_single_waste_export
  AddReferenceNumberController.complete
  click_link('Exporter details')
  ExporterAddressPage.new.check_page_displayed
  click_link('Enter address manually')
  EnterExporterAddressManualPage.new.check_page_displayed
end

And(/^I verify Enter exporter address manual page is displayed$/) do
  EnterExporterAddressManualPage.new.check_page_displayed
  EnterExporterAddressManualPage.new.check_page_translation
end

Then(/^I complete the Enter exporter address manual page$/) do
  ExporterAddressManualController.complete
end

Then(/^I should see manually entered exporter details pre-populated$/) do
  expect(EnterExporterAddressManualPage.new).to have_reference_address TestStatus.test_status(:address1)
  expect(EnterExporterAddressManualPage.new).to have_reference_town TestStatus.test_status(:town)
  expect(EnterExporterAddressManualPage.new).to have_reference_postcode TestStatus.test_status(:postcode)
  expect(ManualAddressEntryWasteCollectionPage.new.option_checked?('England')).to eq(true)
  # expect(EnterExporterAddressManualPage.new).to have_reference_country TestStatus.test_status(:country)
end

And(/^I enter valid input for all the fields on the manual address entry page$/) do
  EnterExporterAddressManualPage.new.enter_address1(Faker::Address.street_name)
  EnterExporterAddressManualPage.new.enter_town(Faker::Address.city)
  EnterExporterAddressManualPage.new.enter_postcode('SE5 9NB')
  EnterExporterAddressManualPage.new.select_first_country_option
end

Then(/^I enter invalid postcode data$/) do
  EnterExporterAddressManualPage.new.enter_address1(Faker::Address.street_name)
  EnterExporterAddressManualPage.new.enter_town(Faker::Address.city)
  EnterExporterAddressManualPage.new.select_first_country_option
end

And(/^I should see page correctly translated$/) do
  EnterExporterAddressManualPage.new.check_page_translation
end

And(/^I verify Exporter details page is displayed$/) do
  ExporterDetailsPage.new.check_page_displayed
end
