Then(/^I should see Are there any other countries the waste will travel through page correctly translated$/) do
  CountriesWasteWillTravelPage.new.check_page_displayed
  CountriesWasteWillTravelPage.new.other_countries_of_waste_translation
end

When(/^I select other countries of waste$/) do
  CountriesWasteWillTravelPage.new.select_country_of_waste
end

Then(/^I should see waste transit countries page correctly translated$/) do
  WasteTransitCountriesPage.new.check_page_displayed
  WasteTransitCountriesPage.new.waste_transit_countries_title_translation
end

And(/^I complete Countries waste will travel through with other country$/) do
  CountriesWasteWillTravelController.complete
end

Then(/^I should see previously entered country the waste travel pre\-populated$/) do
  country = TestStatus.countries_list.join(' ')
  expect(WasteTransitCountriesPage.new.country_location).to eq country
end

Then(/^I should see multiple countries the waste will travel in the correct order$/) do
  country = TestStatus.countries_list.join(' ')
  expect(WasteTransitCountriesPage.new.country_location).to eq country
end

Then(/^I should see change waste will travel through page correctly displayed$/) do
  ChangeWasteTravelCountryPage.new.check_page_displayed
  ChangeWasteTravelCountryPage.new.change_countries_of_waste_translation
end

When(/^I change the country of waste travel to new country$/) do
  TestStatus.reset_test_status
  CountriesWasteWillTravelPage.new.select_country_of_waste
end

Then(/^I should see new entered country the waste travel pre\-populated$/) do
  country = TestStatus.countries_list.join(' ')
  expect(WasteTransitCountriesPage.new.country_location).to eq country
end

Then(/^I should see Remove waste will travel through page correctly displayed$/) do
  RemoveWasteTravelCountryPage.new.check_page_displayed
  RemoveWasteTravelCountryPage.new.remove_countries_of_waste_translation
end

Then(/^I should see No option is preselected on other country page$/) do
  expect(CountriesWasteWillTravelPage.new.option_checked?('No')).to eq(true)
end

And(/^I complete the Journey of a waste section$/) do
  JourneyOfAWasteController.complete
end

When(/^I complete the Journey of a waste section with estimated collection date$/) do
  JourneyOfAWasteController.complete 'No, I’ll enter an estimate date'
end

And(/^I complete the Journey of a waste section with small waste$/) do
  JourneyOfAWasteSmallWasteController.complete
end
