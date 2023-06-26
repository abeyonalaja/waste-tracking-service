# frozen_string_literal: true

# Provides a way to happy path flow
module JourneyOfAWasteController
  def self.complete
    location_leaves_uk_page = LocationWasteLeavesTheUkPage.new
    who_is_waste_carrier_page = WhoIsTheWasteCarrierPage.new
    collection_date_page = CollectionDatePage.new
    mode_of_transport_page = HowWillTheWasteCarrierTransportTheWastePage.new
    waste_carriers_list_page = MultiWasteCarriersPage.new
    waste_carrier_contact_details_page = WhatAreTheWasteCarriersContactDetailsPage.new
    shipping_container_page = ShippingContainerDetailsPage.new
    waste_collection_details_page = WasteCollectionDetailsPage.new
    contact_details_address_page = ContactDetailsCollectionAddressPage.new
    countries_waste_will_travel_page = CountriesWasteWillTravelPage.new

    collection_date_page.choose_option 'Yes, I’ll enter the actual date'
    collection_date_page.enter_actual_collection_date DateTime.now.next_day(7).strftime('%d %m %Y')
    collection_date_page.save_and_continue
    who_is_waste_carrier_page.enter_organisation_name 'CompanyLTD'
    who_is_waste_carrier_page.enter_address 'Sample Address 1'
    who_is_waste_carrier_page.enter_country 'Wales'
    who_is_waste_carrier_page.save_and_continue
    waste_carrier_contact_details_page.enter_organisation_contact 'Nick Pope'
    waste_carrier_contact_details_page.enter_email 'sample@mail.com'
    waste_carrier_contact_details_page.enter_phone_number '+441234567891'
    waste_carrier_contact_details_page.save_and_continue
    mode_of_transport_page.choose_option 'Shipping container'
    mode_of_transport_page.continue
    shipping_container_page.enter_container_number 'ABCD1234567'
    shipping_container_page.save_and_continue
    waste_carriers_list_page.choose_option 'No'
    waste_carriers_list_page.save_and_continue
    waste_collection_details_page.enter_postcode 'AL3 8QE'
    waste_collection_details_page.find_address
    waste_collection_details_page.select_first_address
    waste_collection_details_page.save_and_continue
    contact_details_address_page.enter_organisation_name 'OrgName LTD'
    contact_details_address_page.enter_full_name 'Nick Almiron'
    contact_details_address_page.enter_email 'sample@mail.com'
    contact_details_address_page.enter_phone_number '+441234567891'
    contact_details_address_page.save_and_continue

    location_leaves_uk_page.choose_option 'Yes'
    location_leaves_uk_page.enter_location 'Brighton'
    location_leaves_uk_page.save_and_continue

    sleep(2)
    countries_waste_will_travel_page.choose_option 'Yes'
    countries_waste_will_travel_page.select_country_of_waste
    countries_waste_will_travel_page.save_and_continue

    WasteTransitCountriesPage.new.choose_option 'No'
    WasteTransitCountriesPage.new.save_and_continue
  end
end
