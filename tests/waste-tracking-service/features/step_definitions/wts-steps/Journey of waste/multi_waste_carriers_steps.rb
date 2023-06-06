And(/^I complete the "([^"]*)" waste carrier with "([^"]*)"$/) do |waste_carrier, mode_of_transport|
  waste_carrier_org_name = "#{waste_carrier} WTS Organisation"
  waste_carrier_title = "#{waste_carrier} waste carrier"
  WhoIsTheWasteCarrierPage.new.enter_organisation_name waste_carrier_org_name
  WhoIsTheWasteCarrierPage.new.enter_address "#{waste_carrier}@mail.com"
  WhoIsTheWasteCarrierPage.new.enter_country 'England'
  WhoIsTheWasteCarrierPage.new.save_and_continue
  WhatAreTheWasteCarriersContactDetailsPage.new.enter_organisation_contact 'John Arnold'
  WhatAreTheWasteCarriersContactDetailsPage.new.enter_email 'mail@mail.net'
  WhatAreTheWasteCarriersContactDetailsPage.new.enter_phone_number '+441234567891'
  WhatAreTheWasteCarriersContactDetailsPage.new.enter_fax_number '123Fax'
  TestStatus.waste_carrier_titles(waste_carrier_title)
  TestStatus.waste_carrier_org_details(waste_carrier_org_name)
  WhatAreTheWasteCarriersContactDetailsPage.new.save_and_continue
  HowWillTheWasteCarrierTransportTheWastePage.new.choose_option mode_of_transport
  HowWillTheWasteCarrierTransportTheWastePage.new.save_and_continue
  ShippingContainerDetailsPage.new.enter_container_number 'ABCD1234567'
  ShippingContainerDetailsPage.new.save_and_continue
end

And(/^I should see first waste carrier displayed$/) do
  expect(MultiWasteCarriersPage.new).to have_first_multi_waste_title 'Waste carrier'
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
  (0...TestStatus.waste_carrier_title.count * 2).step(2).each do |i|
    expect(MultiWasteCarriersPage.new.waste_carrier_org_country_name_keys[i].text).to eq 'Organisation name'
    expect(MultiWasteCarriersPage.new.waste_carrier_org_country_name_keys[i + 1].text).to eq 'Country'
    expect(MultiWasteCarriersPage.new.waste_carrier_org_country_name_values[i].text).to eq TestStatus.waste_carrier_org_detail[j]
    expect(MultiWasteCarriersPage.new.waste_carrier_org_country_name_values[i + 1].text).to eq 'England'
    j += 1
  end
end

And(/^I should see change and remove links for each waste carriers$/) do
  (0...TestStatus.waste_carrier_title.count * 2).step(2).each do |i|
    expect(MultiWasteCarriersPage.new.waste_carrier_change_remove_link[i].text.split("\n").first).to eq 'Change'
    expect(MultiWasteCarriersPage.new.waste_carrier_change_remove_link[i + 1].text.split("\n").first).to eq 'Remove'
  end
end

And(/^I should see only change link for first waste carrier$/) do
  expect(MultiWasteCarriersPage.new.waste_carrier_change_remove_link[0].text.split("\n").first).to eq 'Change'
  expect(MultiWasteCarriersPage.new).not_to have_link 'Remove'
end
