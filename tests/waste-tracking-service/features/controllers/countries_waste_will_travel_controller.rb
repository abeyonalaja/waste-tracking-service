# frozen_string_literal: true

# Provides a way to happy path flow
module CountriesWasteWillTravelController
  def self.complete
    countries_waste_will_travel_page = CountriesWasteWillTravelPage.new
    countries_waste_will_travel_page.choose_option 'Yes'
    countries_waste_will_travel_page.select_country_of_waste
    countries_waste_will_travel_page.save_and_continue
    countries_waste_will_travel_page.page_refresh
    WasteTransitCountriesPage.new.choose_option 'No'
    WasteTransitCountriesPage.new.save_and_continue
  end
end
