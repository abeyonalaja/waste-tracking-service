# frozen_string_literal: true

# Provides a way to happy path flow
module WasteCollectionDetailsController
  def self.complete
    sleep 1
    waste_collection_details_page = WasteCollectionDetailsPage.new
    waste_collection_details_page.enter_postcode 'AL3 8QE'
    waste_collection_details_page.find_address
    waste_collection_details_page.select_first_address
    waste_collection_details_page.save_and_continue
    sleep 1
    contact_details_address_page = ContactDetailsCollectionAddressPage.new
    contact_details_address_page.enter_organisation_name 'OrgName LTD'
    contact_details_address_page.enter_full_name 'Nick Almiron'
    contact_details_address_page.enter_email 'sample@mail.com'
    contact_details_address_page.enter_phone_number '+441234567891'
    contact_details_address_page.save_and_continue

    location_leaves_uk_page = LocationWasteLeavesTheUkPage.new
    location_leaves_uk_page.choose_option 'Yes'
    location_leaves_uk_page.enter_location 'Dover'
    location_leaves_uk_page.save_and_continue

    countries_waste_will_travel_page = CountriesWasteWillTravelPage.new
    sleep(2)
    countries_waste_will_travel_page.choose_option 'Yes'
    countries_waste_will_travel_page.select_country_of_waste
    countries_waste_will_travel_page.save_and_continue
    countries_waste_will_travel_page.page_refresh
    sleep(3)
    WasteTransitCountriesPage.new.choose_option 'No'
    sleep(1)
    WasteTransitCountriesPage.new.save_and_continue
  end
end
