# frozen_string_literal: true

# Provides a way to happy path flow
module WasteCarrierBulkWasteController
  def self.complete(no_of_carriers)
    who_is_waste_carrier_page = WhoIsTheWasteCarrierPage.new
    waste_carrier_contact_details_page = WhatAreTheWasteCarriersContactDetailsPage.new
    mode_of_transport_page = HowWillTheWasteCarrierTransportTheWastePage.new
    waste_carriers_list_page = MultiWasteCarriersPage.new
    shipping_container_page = ShippingContainerDetailsPage.new

    sleep(1)
    who_is_waste_carrier_page.enter_organisation_name 'CompanyLTD'
    who_is_waste_carrier_page.enter_address 'Sample Address 1'
    who_is_waste_carrier_page.enter_country 'Wales'
    who_is_waste_carrier_page.save_and_continue
    sleep 1
    waste_carrier_contact_details_page.enter_organisation_contact 'Nick Pope'
    waste_carrier_contact_details_page.enter_email 'sample@mail.com'
    waste_carrier_contact_details_page.enter_phone_number '+441234567891'
    waste_carrier_contact_details_page.save_and_continue
    mode_of_transport_page.choose_option 'Shipping container'
    TestStatus.set_test_status(:waste_carrier_mode_of_transport, 'ShippingContainer')
    mode_of_transport_page.continue
    shipping_container_page.enter_container_number 'ABCD1234567'
    shipping_container_page.save_and_continue

    (1..no_of_carriers).each do
      sleep(1)
      who_is_waste_carrier_page.enter_organisation_name 'CompanyLTD'
      who_is_waste_carrier_page.enter_address 'Sample Address 1'
      who_is_waste_carrier_page.enter_country 'Wales'
      who_is_waste_carrier_page.save_and_continue
      sleep 1
      waste_carrier_contact_details_page.enter_organisation_contact 'Nick Pope'
      waste_carrier_contact_details_page.enter_email 'sample@mail.com'
      waste_carrier_contact_details_page.enter_phone_number '+441234567891'
      waste_carrier_contact_details_page.save_and_continue
      mode_of_transport_page.choose_option 'Shipping container'
      TestStatus.set_test_status(:waste_carrier_mode_of_transport, 'ShippingContainer')
      mode_of_transport_page.continue
      shipping_container_page.enter_container_number 'ABCD1234567'
      shipping_container_page.save_and_continue
      waste_carriers_list_page.choose_option 'No'
      waste_carriers_list_page.save_and_continue
    end

  end
end
