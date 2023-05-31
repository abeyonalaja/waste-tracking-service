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
