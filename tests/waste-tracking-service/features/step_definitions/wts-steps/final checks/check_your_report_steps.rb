And(/^I should see check your report page is correctly translated$/) do
  CheckYourReportPage.new.check_page_translation
end

And(/^I should see export reference correctly displayed$/) do
  CheckYourReportPage.new.check_export_reference
end

And(/^I should see export About the waste section correctly displayed$/) do
  expect(CheckYourReportPage.new.waste_code_header).to eq 'Waste code'
  expect(CheckYourReportPage.new.ewc_code_header).to eq 'EWC codes'
  expect(CheckYourReportPage.new.national_code_header).to eq 'National code'
  expect(CheckYourReportPage.new.waste_description_header).to eq 'Waste description'
  expect(CheckYourReportPage.new.waste_quantity_header).to eq 'Waste quantity'
  # need to uncomment this after fixing the space
  # expect(CheckYourReportPage.new.waste_code_type).to eq TestStatus.test_status(:waste_code)
  expect(CheckYourReportPage.new.waste_code_description).to eq TestStatus.test_status(:waste_code_description)
  expect(CheckYourReportPage.new.ewc_codes).to eq TestStatus.test_status(:ewc_code).gsub(/\s+/, ' ')

  expect(CheckYourReportPage.new.national_code).to eq TestStatus.test_status(:national_code_text)
  expect(CheckYourReportPage.new.describe_the_waste).to eq TestStatus.test_status(:description_of_the_waste)
  expect(CheckYourReportPage.new.waste_quantity).to eq "#{TestStatus.test_status(:weight_quantity_in_tones)} #{TestStatus.test_status(:weight_units)}"
end

And(/^I should see export Exporter and Importer details correctly displayed$/) do
  expect(CheckYourReportPage.new.exporter_address_header).to eq 'Address'
  expect(CheckYourReportPage.new.exporter_country_header).to eq 'Country'
  expect(CheckYourReportPage.new.exporter_organisation_name_header).to eq 'Organisation name'
  expect(CheckYourReportPage.new.exporter_full_name_header).to eq 'Full name'
  expect(CheckYourReportPage.new.exporter_email_header).to eq 'Email address'
  expect(CheckYourReportPage.new.exporter_phone_header).to eq 'Phone number'
  expect(CheckYourReportPage.new.exporter_fax_header).to eq 'Fax number (optional)'

  expect(CheckYourReportPage.new.importer_organisation_name_header).to eq 'Organisation name'
  expect(CheckYourReportPage.new.importer_address_header).to eq 'Address'
  expect(CheckYourReportPage.new.importer_country_header).to eq 'Country'
  expect(CheckYourReportPage.new.importer_full_name_header).to eq 'Full name'
  expect(CheckYourReportPage.new.importer_email_header).to eq 'Email address'
  expect(CheckYourReportPage.new.importer_phone_header).to eq 'Phone number'
  expect(CheckYourReportPage.new.importer_fax_header).to eq 'Fax number (optional)'

  # Data
  # expect(CheckYourReportPage.new.exporter_address).to eq TestStatus.test_status(:exporter_address).sub(/.*?\n/, '')
  expect(CheckYourReportPage.new.exporter_country).to eq 'United Kingdom'
  expect(CheckYourReportPage.new.exporter_organisation_name).to eq TestStatus.test_status(:exporter_org_name)
  expect(CheckYourReportPage.new.exporter_full_name).to eq TestStatus.test_status(:exporter_name)
  expect(CheckYourReportPage.new.exporter_email).to eq TestStatus.test_status(:exporter_email)
  expect(CheckYourReportPage.new.exporter_phone).to eq TestStatus.test_status(:exporter_phone)
  expect(CheckYourReportPage.new.exporter_fax).to eq 'Not provided'

  expect(CheckYourReportPage.new.importer_organisation_name).to eq TestStatus.test_status(:importer_org_name)
  expect(CheckYourReportPage.new.importer_address).to eq TestStatus.test_status(:importer_address)
  expect(CheckYourReportPage.new.importer_country).to eq TestStatus.test_status(:importer_country)

  expect(CheckYourReportPage.new.importer_full_name).to eq TestStatus.test_status(:importer_org_contact)
  expect(CheckYourReportPage.new.importer_email).to eq TestStatus.test_status(:importer_email)
  expect(CheckYourReportPage.new.importer_phone).to eq TestStatus.test_status(:importer_phone_number)
  expect(CheckYourReportPage.new.importer_fax).to eq TestStatus.test_status(:importer_fax_number)
end

And(/^I should see export Journey of waste correctly displayed$/) do

  expect(CheckYourReportPage.new.collection_date_header).to eq 'Collection date'
  # Waste carrier
  # expect(CheckYourReportPage.new.carrier_organisation_name_header0).to eq 'Organisation name'
  expect(CheckYourReportPage.new.carrier_address_header(0)).to eq 'Address'
  expect(CheckYourReportPage.new.carrier_country_header(0)).to eq 'Country'
  expect(CheckYourReportPage.new.carrier_full_name_header(0)).to eq 'Contact person'
  expect(CheckYourReportPage.new.carrier_email_header(0)).to eq 'Email address'
  expect(CheckYourReportPage.new.carrier_phone_header(0)).to eq 'Phone number'
  expect(CheckYourReportPage.new.carrier_fax_header(0)).to eq 'Fax number (optional)'
  expect(CheckYourReportPage.new.carrier_type_header(0)).to eq 'Transport of waste'
  expect(CheckYourReportPage.new.carrier_shipping_container_number_header(0)).to eq 'Shipping container number'
  expect(CheckYourReportPage.new.carrier_vehicle_registration_header(0)).to eq 'Vehicle registration (optional)'

  # waste collection details
  expect(CheckYourReportPage.new.waste_collection_address_header).to eq 'Address'
  expect(CheckYourReportPage.new.waste_collection_country_header).to eq 'Country'
  expect(CheckYourReportPage.new.waste_collection_organisation_header).to eq 'Organisation name'
  expect(CheckYourReportPage.new.waste_collection_full_name_header).to eq 'Contact person'
  expect(CheckYourReportPage.new.waste_collection_email_header).to eq 'Email address'
  expect(CheckYourReportPage.new.waste_collection_phone_header).to eq 'Phone number'
  # waste leaves uk

  expect(CheckYourReportPage.new.exit_location_header).to eq 'Location'
  expect(CheckYourReportPage.new.transit_countries_header).to eq 'Waste transit countries'

  # data check
  # collection-date
  expect(CheckYourReportPage.new.collection_date).to eq HelperMethods.convert_date TestStatus.test_status(:actual_collection_date)
  # waste carrier
  expect(CheckYourReportPage.new.carrier_organisation_name(0)).to eq TestStatus.test_status(:organisation_name)
  expect(CheckYourReportPage.new.carrier_address(0)).to eq TestStatus.test_status(:address)
  expect(CheckYourReportPage.new.carrier_country(0)).to eq TestStatus.test_status(:country)
  expect(CheckYourReportPage.new.carrier_full_name(0)).to eq TestStatus.test_status(:organisation_contact)
  expect(CheckYourReportPage.new.carrier_email(0)).to eq TestStatus.test_status(:email)
  expect(CheckYourReportPage.new.carrier_phone(0)).to eq TestStatus.test_status(:phone_number)
  expect(CheckYourReportPage.new.carrier_fax(0)).to eq 'Not provided'
  expect(CheckYourReportPage.new.carrier_type(0)).to eq TestStatus.test_status(:waste_carrier_mode_of_transport)
  expect(CheckYourReportPage.new.carrier_shipping_container_number(0)).to eq TestStatus.test_status(:container_number)
  expect(CheckYourReportPage.new.carrier_vehicle_registration(0)).to eq 'Not provided'

  # collection details
  # expect(CheckYourReportPage.new.waste_collection_address).to eq TestStatus.test_status(:waste_collection_address)
  expect(CheckYourReportPage.new.waste_collection_country).to eq 'United Kingdom'
  expect(CheckYourReportPage.new.waste_collection_organisation).to eq TestStatus.test_status(:waste_contact_organisation_name)
  expect(CheckYourReportPage.new.waste_collection_full_name).to eq TestStatus.test_status(:waste_contact_full_name)

  expect(CheckYourReportPage.new.waste_collection_email).to eq TestStatus.test_status(:waste_contact_email)
  expect(CheckYourReportPage.new.waste_collection_phone).to eq TestStatus.test_status(:phone_number)
  # expect(CheckYourReportPage.new.waste_collection_fax).to eq 'Not provided'
  expect(CheckYourReportPage.new.exit_location).to eq TestStatus.test_status(:waste_leaves_UK_location)
  expect(CheckYourReportPage.new.transit_countries).to eq TestStatus.countries_list[0]

end

And(/^I should see export Treatment of waste correctly displayed$/) do
  expect(CheckYourReportPage.new.interimsite_org_name_title_0).to eq 'Interim site name'
  expect(CheckYourReportPage.new.interimsite_address_title_0).to eq 'Address'
  expect(CheckYourReportPage.new.interimsite_country_title_0).to eq 'Country'
  expect(CheckYourReportPage.new.interimsite_contact_person_title_0).to eq 'Contact person'
  expect(CheckYourReportPage.new.interimsite_email_title_0).to eq 'Email address'
  expect(CheckYourReportPage.new.interimsite_phone_title_0).to eq 'Phone number'
  expect(CheckYourReportPage.new.interimsite_fax_title_0).to eq 'Fax number (optional)'
  expect(CheckYourReportPage.new.interimsite_code_title_0).to eq 'Recovery code'

  expect(CheckYourReportPage.new.interimsite_org_name_0).to eq TestStatus.test_status(:interim_site_name_name)
  expect(CheckYourReportPage.new.interimsite_address_0).to eq TestStatus.test_status(:interim_site_name_address)
  expect(CheckYourReportPage.new.interimsite_country_0).to eq TestStatus.test_status(:interim_site_name_country)
  expect(CheckYourReportPage.new.interimsite_contact_person_0).to eq TestStatus.test_status(:interim_site_contact_name_full_name)
  expect(CheckYourReportPage.new.interimsite_email_0).to eq TestStatus.test_status(:interim_site_contact_name_email)
  expect(CheckYourReportPage.new.interimsite_phone_0).to eq TestStatus.test_status(:interim_site_contact_name_phone_number)
  expect(CheckYourReportPage.new.interimsite_fax_0).to eq 'Not provided'
  expect(CheckYourReportPage.new.interimsite_code_0).to eq TestStatus.test_status(:interim_site_recovery_code)

  ##Recovery facility
  expect(CheckYourReportPage.new.recoveryfacility_org_name_title(0)).to eq 'Facility name'
  expect(CheckYourReportPage.new.recoveryfacility_address_title(0)).to eq 'Address'
  expect(CheckYourReportPage.new.recoveryfacility_country_title(0)).to eq 'Country'
  expect(CheckYourReportPage.new.recoveryfacility_contact_person_title(0)).to eq 'Contact person'
  expect(CheckYourReportPage.new.recoveryfacility_email_title(0)).to eq 'Email address'
  expect(CheckYourReportPage.new.recoveryfacility_phone_title(0)).to eq 'Phone number'
  expect(CheckYourReportPage.new.recoveryfacility_fax_title(0)).to eq 'Fax number (optional)'
  expect(CheckYourReportPage.new.recoveryfacility_code_title(0)).to eq 'Recovery code'

  expect(CheckYourReportPage.new.recoveryfacility_org_name(0)).to eq TestStatus.test_status(:recovery_facility_name)
  expect(CheckYourReportPage.new.recoveryfacility_address(0)).to eq TestStatus.test_status(:recovery_facility_address)
  expect(CheckYourReportPage.new.recoveryfacility_country(0)).to eq TestStatus.test_status(:recovery_facility_country)
  expect(CheckYourReportPage.new.recoveryfacility_contact_person(0)).to eq TestStatus.test_status(:recovery_facility_full_name)

  expect(CheckYourReportPage.new.recoveryfacility_email(0)).to eq TestStatus.test_status(:recovery_facility_email)
  expect(CheckYourReportPage.new.recoveryfacility_phone(0)).to eq TestStatus.test_status(:recovery_facility_phone_number)
  expect(CheckYourReportPage.new.recoveryfacility_fax(0)).to eq 'Not provided'
  expect(CheckYourReportPage.new.recoveryfacility_code(0)).to eq TestStatus.test_status(:first_recovery_facility_code)

end

Then(/^I should see Estimate Collection date$/) do
  expect(CheckYourReportPage.new.collection_date).to eq "Estimated #{HelperMethods.convert_date TestStatus.test_status(:estimate_collection_date)}"
end

And(/^I should see Estimate Quantity of Waste$/) do
  expect(CheckYourReportPage.new.waste_quantity).to eq "Estimated #{TestStatus.test_status(:weight_quantity_in_tones)} #{TestStatus.test_status(:weight_units)}"
end

Then(/^I should see (\d+) waste carriers on check your export page$/) do |waste_carriers|
  (0...waste_carriers).each do |i|
    puts "checking for #{i}"
    within(CheckYourReportPage.new.waste_carriers_list(i)) do
      # Waste carrier
      # expect(CheckYourReportPage.new.carrier_organisation_name_headeri).to eq 'Organisation name'
      expect(CheckYourReportPage.new.carrier_address_header(i)).to eq 'Address'
      expect(CheckYourReportPage.new.carrier_country_header(i)).to eq 'Country'
      expect(CheckYourReportPage.new.carrier_full_name_header(i)).to eq 'Contact person'
      expect(CheckYourReportPage.new.carrier_email_header(i)).to eq 'Email address'
      expect(CheckYourReportPage.new.carrier_phone_header(i)).to eq 'Phone number'
      expect(CheckYourReportPage.new.carrier_fax_header(i)).to eq 'Fax number (optional)'
      expect(CheckYourReportPage.new.carrier_type_header(i)).to eq 'Transport of waste'
      expect(CheckYourReportPage.new.carrier_shipping_container_number_header(i)).to eq 'Shipping container number'
      expect(CheckYourReportPage.new.carrier_vehicle_registration_header(i)).to eq 'Vehicle registration (optional)'

      # waste carrier
      expect(CheckYourReportPage.new.carrier_organisation_name(i)).to eq TestStatus.waste_carrier_org_detail[i]
      expect(CheckYourReportPage.new.carrier_address(i)).to eq TestStatus.waste_carrier_address[i]
      expect(CheckYourReportPage.new.carrier_country(i)).to eq TestStatus.test_status(:country)
      expect(CheckYourReportPage.new.carrier_full_name(i)).to eq TestStatus.test_status(:organisation_contact)
      expect(CheckYourReportPage.new.carrier_email(i)).to eq TestStatus.test_status(:email)
      expect(CheckYourReportPage.new.carrier_phone(i)).to eq TestStatus.test_status(:phone_number)
      expect(CheckYourReportPage.new.carrier_fax(i)).to eq '123Fax'
      expect(CheckYourReportPage.new.carrier_type(i)).to eq TestStatus.test_status(:First_mode_of_travel).gsub(/(\bcontainer\b)/i) { $1.capitalize }.gsub(' ', '')
      expect(CheckYourReportPage.new.carrier_shipping_container_number(i)).to eq TestStatus.test_status(:First_container_number)
      expect(CheckYourReportPage.new.carrier_vehicle_registration(i)).to eq TestStatus.test_status(:First_vehicle_number)
    end
  end

end

And(/^I should see (\d+) ewc codes on check your export page$/) do |ewc_codes|
  expect(CheckYourReportPage.new.ewc_codes_list.count).to eq TestStatus.ewc_code_list.size
  (0...ewc_codes).each do |i|
    expect(CheckYourReportPage.new.ewc_codes_list[i].text.gsub(/\s+/, ' ')).to eq TestStatus.ewc_code_list[i].gsub(/\s+/, ' ')
  end
end

And(/^I should see (\d+) recovery facilities on check your export page$/) do |recover_facilities|
  (0...recover_facilities).each do |i|
    ##Recovery facility
    expect(CheckYourReportPage.new.recoveryfacility_org_name_title(i)).to eq 'Facility name'
    expect(CheckYourReportPage.new.recoveryfacility_address_title(i)).to eq 'Address'
    expect(CheckYourReportPage.new.recoveryfacility_country_title(i)).to eq 'Country'
    expect(CheckYourReportPage.new.recoveryfacility_contact_person_title(i)).to eq 'Contact person'
    expect(CheckYourReportPage.new.recoveryfacility_email_title(i)).to eq 'Email address'
    expect(CheckYourReportPage.new.recoveryfacility_phone_title(i)).to eq 'Phone number'
    expect(CheckYourReportPage.new.recoveryfacility_fax_title(i)).to eq 'Fax number (optional)'
    expect(CheckYourReportPage.new.recoveryfacility_code_title(i)).to eq 'Recovery code'

    recovery_facility = i == 0 ? 'first' : 'second'
    expect(CheckYourReportPage.new.recoveryfacility_org_name(i)).to eq TestStatus.test_status("#{recovery_facility}_recovery_facility_name".to_sym)
    expect(CheckYourReportPage.new.recoveryfacility_address(i)).to eq TestStatus.test_status("#{recovery_facility}_recovery_facility_address".to_sym)
    expect(CheckYourReportPage.new.recoveryfacility_country(i)).to eq TestStatus.test_status("#{recovery_facility}_recovery_facility_country".to_sym)
    expect(CheckYourReportPage.new.recoveryfacility_contact_person(i)).to eq TestStatus.test_status("#{recovery_facility}_recovery_facility_full_name".to_sym)

    expect(CheckYourReportPage.new.recoveryfacility_email(i)).to eq TestStatus.test_status("#{recovery_facility}_recovery_facility_email".to_sym)
    expect(CheckYourReportPage.new.recoveryfacility_phone(i)).to eq TestStatus.test_status("#{recovery_facility}_recovery_facility_phone_number".to_sym)
    expect(CheckYourReportPage.new.recoveryfacility_fax(i)).to eq TestStatus.test_status("#{recovery_facility}_recovery_facility_fax_number".to_sym)
    expect(CheckYourReportPage.new.recoveryfacility_code(i)).to eq TestStatus.test_status(:first_recovery_facility_code)
  end
end

When(/^I click your own reference Change link$/) do
  CheckYourReportPage.new.your_ref_change
end

When(/^I click waste code Change link$/) do
  CheckYourReportPage.new.waste_code_type_change
end

When(/^I click ewc code Change link$/) do
  CheckYourReportPage.new.ewc_code_change
end

When(/^I click national code Change link$/) do
  CheckYourReportPage.new.national_code_change
end

When(/^I click Waste description Change link$/) do
  CheckYourReportPage.new.waste_description_change
end

When(/^I click Waste quantity Change link$/) do
  CheckYourReportPage.new.waste_quantity_change
end

When(/^I click Exporter address Change link$/) do
  CheckYourReportPage.new.exporter_address_change
end

When(/^I click Exporter details Change link$/) do
  CheckYourReportPage.new.exporter_organisation_name_change
end

Then(/^I should see selected EWC code on EWC codes page$/) do
  expect(DoYouHaveEwcCodePage.new).to have_text(TestStatus.test_status(:ewc_code).gsub(/\s+/, ' '))
end

When(/^I click on Collection date Change link$/) do
  CheckYourReportPage.new.collection_date_change
end

When(/^I click on Waste carrier Change link$/) do
  CheckYourReportPage.new.carrier_change 0
end

When(/^I click on Waste carrier contact Change link$/) do
  CheckYourReportPage.new.carrier_contact_details_change 0
end

When(/^I click the waste carrier transport Change link$/) do
  CheckYourReportPage.new.carrier_type_change 0
end

When(/^I click waste carrier details Change link$/) do
  CheckYourReportPage.new.carrier_details_change 0
end

Then(/^I click waste collection address Change link$/) do
  CheckYourReportPage.new.waste_collection_address_change
end

When(/^I click waste collection contact change link$/) do
  CheckYourReportPage.new.waste_collection_full_name_change
end

When(/^I click waste leaves location change link$/) do
  CheckYourReportPage.new.exit_location_change
end

When(/^I click transit countries change link$/) do
  CheckYourReportPage.new.transit_countries_change
end

Then(/^I should see warning text on check your report page$/) do
  CheckYourReportPage.new.check_warning_text
end

And(/^I verify Change waste code page is translated correctly$/) do
  ChangeWasteCodePage.new.check_page_translation
end

And(/^I click Continue and change waste code button$/) do
  ChangeWasteCodePage.new.change_waste_code_button
end

And(/^I click Confirm all answers button$/) do
  CheckYourReportPage.new.confirm_answers_button
end

And(/^I should see export Journey of waste with estimated collection date correctly displayed$/) do

  expect(CheckYourReportPage.new.collection_date_header).to eq 'Collection date'
  # Waste carrier
  # expect(CheckYourReportPage.new.carrier_organisation_name_header0).to eq 'Organisation name'
  expect(CheckYourReportPage.new.carrier_address_header(0)).to eq 'Address'
  expect(CheckYourReportPage.new.carrier_country_header(0)).to eq 'Country'
  expect(CheckYourReportPage.new.carrier_full_name_header(0)).to eq 'Contact person'
  expect(CheckYourReportPage.new.carrier_email_header(0)).to eq 'Email address'
  expect(CheckYourReportPage.new.carrier_phone_header(0)).to eq 'Phone number'
  expect(CheckYourReportPage.new.carrier_fax_header(0)).to eq 'Fax number (optional)'
  expect(CheckYourReportPage.new.carrier_type_header(0)).to eq 'Transport of waste'
  expect(CheckYourReportPage.new.carrier_shipping_container_number_header(0)).to eq 'Shipping container number'
  expect(CheckYourReportPage.new.carrier_vehicle_registration_header(0)).to eq 'Vehicle registration (optional)'

  # waste collection details
  expect(CheckYourReportPage.new.waste_collection_address_header).to eq 'Address'
  expect(CheckYourReportPage.new.waste_collection_country_header).to eq 'Country'
  expect(CheckYourReportPage.new.waste_collection_organisation_header).to eq 'Organisation name'
  expect(CheckYourReportPage.new.waste_collection_full_name_header).to eq 'Contact person'
  expect(CheckYourReportPage.new.waste_collection_email_header).to eq 'Email address'
  expect(CheckYourReportPage.new.waste_collection_phone_header).to eq 'Phone number'
  # waste leaves uk

  expect(CheckYourReportPage.new.exit_location_header).to eq 'Location'
  expect(CheckYourReportPage.new.transit_countries_header).to eq 'Waste transit countries'

  # data check
  # collection-date
  collection_date = HelperMethods.convert_date TestStatus.test_status(:estimate_collection_date)
  expect(CheckYourReportPage.new.collection_date).to eq "Estimated " + collection_date
  # waste carrier
  expect(CheckYourReportPage.new.carrier_organisation_name(0)).to eq TestStatus.test_status(:organisation_name)
  expect(CheckYourReportPage.new.carrier_address(0)).to eq TestStatus.test_status(:address)
  expect(CheckYourReportPage.new.carrier_country(0)).to eq TestStatus.test_status(:country)
  expect(CheckYourReportPage.new.carrier_full_name(0)).to eq TestStatus.test_status(:organisation_contact)
  expect(CheckYourReportPage.new.carrier_email(0)).to eq TestStatus.test_status(:email)
  expect(CheckYourReportPage.new.carrier_phone(0)).to eq TestStatus.test_status(:phone_number)
  expect(CheckYourReportPage.new.carrier_fax(0)).to eq 'Not provided'
  expect(CheckYourReportPage.new.carrier_type(0)).to eq TestStatus.test_status(:waste_carrier_mode_of_transport)
  expect(CheckYourReportPage.new.carrier_shipping_container_number(0)).to eq TestStatus.test_status(:container_number)
  expect(CheckYourReportPage.new.carrier_vehicle_registration(0)).to eq 'Not provided'

  # collection details
  # expect(CheckYourReportPage.new.waste_collection_address).to eq TestStatus.test_status(:waste_collection_address)
  expect(CheckYourReportPage.new.waste_collection_country).to eq 'United Kingdom'
  expect(CheckYourReportPage.new.waste_collection_organisation).to eq TestStatus.test_status(:waste_contact_organisation_name)
  expect(CheckYourReportPage.new.waste_collection_full_name).to eq TestStatus.test_status(:waste_contact_full_name)

  expect(CheckYourReportPage.new.waste_collection_email).to eq TestStatus.test_status(:waste_contact_email)
  expect(CheckYourReportPage.new.waste_collection_phone).to eq TestStatus.test_status(:phone_number)
  # expect(CheckYourReportPage.new.waste_collection_fax).to eq 'Not provided'
  expect(CheckYourReportPage.new.exit_location).to eq TestStatus.test_status(:waste_leaves_UK_location)
  expect(CheckYourReportPage.new.transit_countries).to eq TestStatus.countries_list[0]
end
