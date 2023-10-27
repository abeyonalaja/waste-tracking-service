And(/^I enter valid postcode$/) do
  postcode = 'ng23lp'
  ExporterAddressPage.new.enter_postcode postcode
  TestStatus.set_test_status(:postcode, postcode)
  Log.info("Exporter postcode is #{postcode}")
end

And(/^I click Find Address button$/) do
  ExporterAddressPage.new.find_address
end

And(/^I choose first address from the list$/) do
  ExporterAddressPage.new.choose_first_address
end

Then(/^I verify the postcode field is displayed with the initial postcode pre\-populated$/) do
  expect(ExporterAddressPage.new).to have_postcode TestStatus.test_status(:postcode)
end

And(/^I enter invalid postcode$/) do
  postcode = '123'
  ExporterAddressPage.new.enter_postcode postcode
  TestStatus.set_test_status(:postcode, postcode)
end

And(/^I should see Exporter details page correctly translated$/) do
  ExporterAddressPage.new.check_page_translation
end

And(/^I should see exporter postcode page is correctly translated$/) do
  ExporterAddressPage.new.check_postcode_translation
end

When(/^I change exporter address with new address$/) do
  ##need to more to manual entry page
  ExporterAddressPage.new.address_line_1 'Seacole Building'
  ExporterAddressPage.new.address_line_2 '2 Marsham St'
  ExporterAddressPage.new.town_city 'London'
  EnterExporterAddressManualPage.new.select_first_country_option
  ExporterAddressPage.new.exporter_postcode 'SW1P 4DF'
  TestStatus.set_test_status(:exporter_address, 'Seacole Building,2 Marsham St,London,SW1P 4DF,England')
end
