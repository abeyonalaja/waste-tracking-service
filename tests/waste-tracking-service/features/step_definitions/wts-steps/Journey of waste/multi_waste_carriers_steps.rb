And(/^I complete the "([^"]*)" waste carrier with "([^"]*)"$/) do |waste_carrier, mode_of_transport|
  waste_carrier_org_name = "#{waste_carrier} WTS Organisation"
  waste_carrier_title = "#{waste_carrier} waste carrier"
  waste_carrier_address = "#{waste_carrier} waste carrier address"
  sleep 1
  WhoIsTheWasteCarrierPage.new.check_page_title(waste_carrier)
  WhoIsTheWasteCarrierPage.new.enter_organisation_name waste_carrier_org_name
  WhoIsTheWasteCarrierPage.new.enter_address waste_carrier_address
  WhoIsTheWasteCarrierPage.new.enter_country 'England'
  WhoIsTheWasteCarrierPage.new.save_and_continue
  sleep 1
  WhatAreTheWasteCarriersContactDetailsPage.new.check_page_title(waste_carrier)
  WhatAreTheWasteCarriersContactDetailsPage.new.enter_organisation_contact 'John Arnold'
  WhatAreTheWasteCarriersContactDetailsPage.new.enter_email 'mail@mail.net'
  WhatAreTheWasteCarriersContactDetailsPage.new.enter_phone_number '+441234567891'
  WhatAreTheWasteCarriersContactDetailsPage.new.enter_fax_number '12345678910'
  TestStatus.waste_carrier_titles(waste_carrier_title)
  TestStatus.waste_carrier_addresses(waste_carrier_address)
  TestStatus.waste_carrier_org_details(waste_carrier_org_name)
  WhatAreTheWasteCarriersContactDetailsPage.new.save_and_continue
  sleep 1
  transport_description = 'Shipping container-ABC123, vehicle registrations-AB1234, IMO-123456,Freight numbers-AB12ER, trailer numbers-123456,Specialist containers being transported-ABC123,Call signs-XYZ1234567,Container -12345'
  TestStatus.set_test_status(:transport_description, transport_description)

  case mode_of_transport
  when 'Road'
    HowWillTheWasteCarrierTransportTheWastePage.new.check_page_displayed waste_carrier.downcase
    HowWillTheWasteCarrierTransportTheWastePage.new.choose_option mode_of_transport
    HowWillTheWasteCarrierTransportTheWastePage.new.save_and_continue
    sleep 0.5
    RoadTransportDetailsPage.new.check_page_displayed waste_carrier.downcase, mode_of_transport.downcase
    RoadTransportDetailsPage.new.enter_transportation_description transport_description
    RoadTransportDetailsPage.new.save_and_continue
    TestStatus.mode_of_travel_list(mode_of_transport)
  when 'Sea'
    HowWillTheWasteCarrierTransportTheWastePage.new.check_page_displayed waste_carrier.downcase
    HowWillTheWasteCarrierTransportTheWastePage.new.choose_option mode_of_transport
    HowWillTheWasteCarrierTransportTheWastePage.new.save_and_continue
    sleep 0.5
    RoadTransportDetailsPage.new.check_page_displayed waste_carrier.downcase, mode_of_transport.downcase
    RoadTransportDetailsPage.new.enter_transportation_description transport_description
    SeaTransportDetailsPage.new.save_and_continue
    TestStatus.mode_of_travel_list(mode_of_transport)
  when 'Air'
    HowWillTheWasteCarrierTransportTheWastePage.new.check_page_displayed waste_carrier.downcase
    HowWillTheWasteCarrierTransportTheWastePage.new.choose_option mode_of_transport
    HowWillTheWasteCarrierTransportTheWastePage.new.save_and_continue
    sleep 0.5
    RoadTransportDetailsPage.new.check_page_displayed waste_carrier.downcase, mode_of_transport.downcase
    RoadTransportDetailsPage.new.enter_transportation_description transport_description
    AirTransportDetailsPage.new.save_and_continue
    TestStatus.mode_of_travel_list(mode_of_transport)
  when 'Rail'
    HowWillTheWasteCarrierTransportTheWastePage.new.check_page_displayed waste_carrier.downcase
    HowWillTheWasteCarrierTransportTheWastePage.new.choose_option mode_of_transport
    HowWillTheWasteCarrierTransportTheWastePage.new.save_and_continue
    sleep 0.5
    RoadTransportDetailsPage.new.check_page_displayed waste_carrier.downcase, mode_of_transport.downcase
    RoadTransportDetailsPage.new.enter_transportation_description transport_description
    RailTransportDetailsPage.new.save_and_continue
    TestStatus.mode_of_travel_list(mode_of_transport)
  when 'Inland waterways'
    HowWillTheWasteCarrierTransportTheWastePage.new.check_page_displayed waste_carrier.downcase
    HowWillTheWasteCarrierTransportTheWastePage.new.choose_option mode_of_transport
    HowWillTheWasteCarrierTransportTheWastePage.new.save_and_continue
    sleep 0.5
    RoadTransportDetailsPage.new.check_page_displayed waste_carrier.downcase, mode_of_transport.downcase
    RoadTransportDetailsPage.new.enter_transportation_description transport_description
    InlandWaterTransportDetailsPage.new.save_and_continue
    TestStatus.mode_of_travel_list(mode_of_transport)
  end
end

And(/^I should see first waste carrier displayed$/) do
  first_title = Translations.value 'exportJourney.wasteCarrier.carriersPage.cardTitle'
  expect(MultiWasteCarriersPage.new).to have_first_multi_waste_title first_title.gsub!('{{n}}', 'First')
end

And(/^I should see five waste carrier details displayed$/) do
  expect(MultiWasteCarriersPage.new).to have_multi_waste_title TestStatus.waste_carrier_title
end

Then(/^I should see add carrier correctly translated$/) do
  MultiWasteCarriersPage.new.check_translation
end

Then(/^I should see max waste carrier correctly translated$/) do
  MultiWasteCarriersPage.new.check_max_carrier_translation
end

And(/^I should see org nam and country for each waste carries$/) do
  j = 0
  (0...TestStatus.waste_carrier_title.count).each do |i|
    expect(MultiWasteCarriersPage.new.waste_carrier_org_name_keys(i).text).to eq Translations.value 'contact.orgName'
    expect(MultiWasteCarriersPage.new.waste_carrier_country_name_keys(i).text).to eq Translations.value 'address.country'
    expect(MultiWasteCarriersPage.new.waste_carrier_org_name_value(i).text).to eq TestStatus.waste_carrier_org_detail[j]
    expect(MultiWasteCarriersPage.new.waste_carrier_country_name_value(i).text).to eq 'England'
    j += 1
  end
end

And(/^I should see change and remove links for each waste carriers$/) do
  (1...TestStatus.waste_carrier_title.count).each do |i|
    expect(MultiWasteCarriersPage.new.waste_carrier_change_link(i).text.split("\n").first).to eq Translations.value 'actions.change'
    expect(MultiWasteCarriersPage.new.waste_carrier_remove_link(i).text.split("\n").first).to eq Translations.value 'actions.remove'
  end
end

And(/^I should see only change link for first waste carrier$/) do
  expect(MultiWasteCarriersPage.new.waste_carrier_change_link(1).text.split("\n").first).to eq Translations.value 'actions.change'
  expect(MultiWasteCarriersPage.new).not_to have_link Translations.value 'actions.remove'
end

And(/^I complete the "([^"]*)" waste carrier with "([^"]*)" without transportation details$/) do |waste_carrier, mode_of_transport|
  waste_carrier_org_name = "#{waste_carrier} WTS Organisation"
  waste_carrier_title = "#{waste_carrier} waste carrier"
  waste_carrier_address = "#{waste_carrier} waste carrier address"
  sleep 1
  WhoIsTheWasteCarrierPage.new.enter_organisation_name waste_carrier_org_name
  WhoIsTheWasteCarrierPage.new.enter_address waste_carrier_address
  WhoIsTheWasteCarrierPage.new.enter_country 'England'
  WhoIsTheWasteCarrierPage.new.save_and_continue
  sleep 1
  WhatAreTheWasteCarriersContactDetailsPage.new.enter_organisation_contact 'John Arnold'
  WhatAreTheWasteCarriersContactDetailsPage.new.enter_email 'mail@mail.net'
  WhatAreTheWasteCarriersContactDetailsPage.new.enter_phone_number '+441234567891'
  WhatAreTheWasteCarriersContactDetailsPage.new.enter_fax_number '12345678910'
  TestStatus.waste_carrier_titles(waste_carrier_title)
  TestStatus.waste_carrier_addresses(waste_carrier_address)
  TestStatus.waste_carrier_org_details(waste_carrier_org_name)
  WhatAreTheWasteCarriersContactDetailsPage.new.save_and_continue
  sleep 1

  case mode_of_transport
  when 'Road'
    HowWillTheWasteCarrierTransportTheWastePage.new.choose_option mode_of_transport
    HowWillTheWasteCarrierTransportTheWastePage.new.save_and_continue
    sleep 0.5
    TestStatus.mode_of_travel_list(mode_of_transport)
  when 'Sea'
    HowWillTheWasteCarrierTransportTheWastePage.new.choose_option mode_of_transport
    HowWillTheWasteCarrierTransportTheWastePage.new.save_and_continue
    sleep 0.5
    TestStatus.mode_of_travel_list(mode_of_transport)
  when 'Air'
    HowWillTheWasteCarrierTransportTheWastePage.new.choose_option mode_of_transport
    HowWillTheWasteCarrierTransportTheWastePage.new.save_and_continue
    sleep 0.5
    TestStatus.mode_of_travel_list(mode_of_transport)
  when 'Rail'
    HowWillTheWasteCarrierTransportTheWastePage.new.choose_option mode_of_transport
    HowWillTheWasteCarrierTransportTheWastePage.new.save_and_continue
    sleep 0.5
    TestStatus.mode_of_travel_list(mode_of_transport)
  when 'Inland waterways'
    HowWillTheWasteCarrierTransportTheWastePage.new.choose_option mode_of_transport
    HowWillTheWasteCarrierTransportTheWastePage.new.save_and_continue
    sleep 0.5
    TestStatus.mode_of_travel_list(mode_of_transport)
  end
  TestStatus.set_test_status(:transport_description, 'Not provided')
  RoadTransportDetailsPage.new.save_and_continue
end
