# frozen_string_literal: true

# Provides a way to happy path flow
module WasteCarrierBulkWasteController
  def self.complete(no_of_carriers)
    who_is_waste_carrier_page = WhoIsTheWasteCarrierPage.new
    waste_carrier_contact_details_page = WhatAreTheWasteCarriersContactDetailsPage.new
    how_will_the_waste_carrier_transport_the_waste_page = HowWillTheWasteCarrierTransportTheWastePage.new
    waste_carriers_list_page = MultiWasteCarriersPage.new
    road_transport_details_page = RoadTransportDetailsPage.new

    sleep(1)
    who_is_waste_carrier_page.check_page_displayed
    who_is_waste_carrier_page.enter_organisation_name 'CompanyLTD'
    who_is_waste_carrier_page.enter_address 'Sample Address 1'
    who_is_waste_carrier_page.enter_country 'Wales'
    who_is_waste_carrier_page.save_and_continue
    sleep 1
    waste_carrier_contact_details_page.check_page_displayed
    waste_carrier_contact_details_page.enter_organisation_contact 'Nick Pope'
    waste_carrier_contact_details_page.enter_email 'sample@mail.com'
    waste_carrier_contact_details_page.enter_phone_number '+359-8988-1(434)5'
    waste_carrier_contact_details_page.save_and_continue
    how_will_the_waste_carrier_transport_the_waste_page.check_page_displayed
    how_will_the_waste_carrier_transport_the_waste_page.choose_option 'Road'
    TestStatus.set_test_status(:waste_carrier_mode_of_transport, 'Road')
    how_will_the_waste_carrier_transport_the_waste_page.save_and_continue
    road_transport_details_page.check_page_displayed
    road_transport_details_page.enter_transportation_description 'Sample transport description'
    road_transport_details_page.save_and_continue
    if no_of_carriers > 1
      (1..no_of_carriers).each do |i|
        sleep(1)
        who_is_waste_carrier_page.check_page_title(i + 1)
        who_is_waste_carrier_page.enter_organisation_name 'CompanyLTD'
        who_is_waste_carrier_page.enter_address 'Sample Address 1'
        who_is_waste_carrier_page.enter_country 'Wales'
        who_is_waste_carrier_page.save_and_continue
        sleep 1
        waste_carrier_contact_details_page.check_page_title(i + 1)
        waste_carrier_contact_details_page.enter_organisation_contact 'Nick Pope'
        waste_carrier_contact_details_page.enter_email 'sample@mail.com'
        waste_carrier_contact_details_page.enter_phone_number '+359-8988-1(434)5'
        waste_carrier_contact_details_page.save_and_continue
        how_will_the_waste_carrier_transport_the_waste_page.check_page_displayed
        how_will_the_waste_carrier_transport_the_waste_page.choose_option 'Road'
        TestStatus.set_test_status(:waste_carrier_mode_of_transport, 'Road')
        how_will_the_waste_carrier_transport_the_waste_page.save_and_continue
        road_transport_details_page.check_page_displayed
        road_transport_details_page.enter_transportation_description 'sample transport description'
        road_transport_details_page.save_and_continue
        waste_carriers_list_page.choose_option 'No'
        waste_carriers_list_page.save_and_continue
      end
    else
      waste_carriers_list_page.choose_option 'No'
      waste_carriers_list_page.save_and_return
    end
  end
end
