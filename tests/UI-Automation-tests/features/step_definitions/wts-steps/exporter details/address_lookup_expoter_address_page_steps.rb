And(/^I enter valid postcode$/) do
  postcode = 'n1p3bp'
  ExporterAddressPage.new.enter_input_value postcode
  TestStatus.set_test_status(:postcode, postcode)
  Log.info("Exporter postcode is #{postcode}")
end

And(/^I click Find Address button$/) do
  click_on Translations.value 'postcode.findButton'
end

And(/^I select first address from the lookup$/) do
  ExporterAddressPage.new.select_first_address
end

Then(/^I verify the postcode field is displayed with the initial postcode pre\-populated$/) do
  expect(ExporterAddressPage.new).to have_reference TestStatus.test_status(:postcode)
end

And(/^I enter invalid postcode$/) do
  postcode = '123'
  ExporterAddressPage.new.enter_input_value postcode
  TestStatus.set_test_status(:postcode, postcode)
end

And(/^I verify address is visible with Change address link displayed on the page$/) do
  expect(page).to have_link('Change address')
end
