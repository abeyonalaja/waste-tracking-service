And(/^I should see check your report page is correctly translated$/) do
  CheckYourRecordPage.new.check_page_translation
end

And(/^I should see check your report page is correctly translated for small waste$/) do
  CheckYourRecordPage.new.check_page_translation_for_small_waste
end

And(/^I should see export reference correctly displayed$/) do
  CheckYourRecordPage.new.check_export_reference
end

And(/^I should see export About the waste section correctly displayed$/) do
  expect(CheckYourRecordPage.new.waste_code_header).to eq Translations.value 'exportJourney.checkAnswers.wasteCode'
  expect(CheckYourRecordPage.new.ewc_code_header).to eq Translations.value 'exportJourney.checkAnswers.ewcCodes'
  expect(CheckYourRecordPage.new.national_code_header).to eq Translations.value 'exportJourney.checkAnswers.nationalCode'
  expect(CheckYourRecordPage.new.waste_description_header).to eq Translations.value 'exportJourney.checkAnswers.wasteDescription'
  expect(CheckYourRecordPage.new.waste_quantity_header).to eq Translations.value 'exportJourney.checkAnswers.wasteQuantity'
  expect(CheckYourRecordPage.new.waste_code_type).to eq TestStatus.test_status(:waste_code).gsub(/\s+/, '').gsub(' ', '')
  expect(CheckYourRecordPage.new.waste_code_description).to eq TestStatus.test_status(:waste_code_description)
  description = TestData.get_ewc_code_description(TestStatus.test_status(:ewc_code))
  expect(CheckYourRecordPage.new.ewc_codes).to eq "#{TestStatus.test_status(:ewc_code).gsub(/(..)(?=.)/, '\1 ')}: #{description}"

  expect(CheckYourRecordPage.new.national_code).to eq TestStatus.test_status(:national_code_text)
  expect(CheckYourRecordPage.new.describe_the_waste).to eq TestStatus.test_status(:description_of_the_waste)
  expect(CheckYourRecordPage.new.waste_quantity).to eq "#{TestStatus.test_status(:weight_quantity_in_tones)} #{TestStatus.test_status(:weight_units)}"
end

And(/^I should see export Exporter and Importer details correctly displayed$/) do
  expect(CheckYourRecordPage.new.exporter_address_header).to eq Translations.value 'address'
  expect(CheckYourRecordPage.new.exporter_country_header).to eq Translations.value 'address.country'
  expect(CheckYourRecordPage.new.exporter_organisation_name_header).to eq Translations.value 'contact.orgName'
  expect(CheckYourRecordPage.new.exporter_full_name_header).to eq Translations.value 'contact.fullName'
  expect(CheckYourRecordPage.new.exporter_email_header).to eq Translations.value 'contact.emailAddress'
  expect(CheckYourRecordPage.new.exporter_phone_header).to eq Translations.value 'contact.phoneNumber'
  expect(CheckYourRecordPage.new.exporter_fax_header).to eq Translations.value 'contact.faxNumber'

  expect(CheckYourRecordPage.new.importer_organisation_name_header).to eq Translations.value 'contact.orgName'
  expect(CheckYourRecordPage.new.importer_address_header).to eq Translations.value 'address'
  expect(CheckYourRecordPage.new.importer_country_header).to eq Translations.value 'address.country'
  expect(CheckYourRecordPage.new.importer_full_name_header).to eq Translations.value 'contact.fullName'
  expect(CheckYourRecordPage.new.importer_email_header).to eq Translations.value 'contact.emailAddress'
  expect(CheckYourRecordPage.new.importer_phone_header).to eq Translations.value 'contact.phoneNumber'
  expect(CheckYourRecordPage.new.importer_fax_header).to eq Translations.value 'contact.faxNumber'

  # Data
  country, address = HelperMethods.address(TestStatus.test_status(:exporter_address))
  expect(CheckYourRecordPage.new.exporter_address.gsub("\n", ', ')).to eq address
  expect(CheckYourRecordPage.new.exporter_country).to eq country
  expect(CheckYourRecordPage.new.exporter_organisation_name).to eq TestStatus.test_status(:exporter_org_name)
  expect(CheckYourRecordPage.new.exporter_full_name).to eq TestStatus.test_status(:exporter_name)
  expect(CheckYourRecordPage.new.exporter_email).to eq TestStatus.test_status(:exporter_email)
  expect(CheckYourRecordPage.new.exporter_phone).to eq TestStatus.test_status(:exporter_phone)
  expect(CheckYourRecordPage.new.exporter_fax).to eq Translations.value 'exportJourney.checkAnswers.notProvided'

  expect(CheckYourRecordPage.new.importer_organisation_name).to eq TestStatus.test_status(:importer_org_name)
  expect(CheckYourRecordPage.new.importer_address).to eq TestStatus.test_status(:importer_address)
  expect(CheckYourRecordPage.new.importer_country).to eq TestStatus.test_status(:importer_country)
  expect(CheckYourRecordPage.new.importer_full_name).to eq TestStatus.test_status(:importer_org_contact)
  expect(CheckYourRecordPage.new.importer_email).to eq TestStatus.test_status(:importer_email)
  expect(CheckYourRecordPage.new.importer_phone).to eq TestStatus.test_status(:importer_phone_number)
  expect(CheckYourRecordPage.new.importer_fax).to eq TestStatus.test_status(:importer_fax_number)
end

And(/^I should see export Journey of waste correctly displayed$/) do
  expect(CheckYourRecordPage.new.collection_date_header).to eq Translations.value 'exportJourney.submittedAnnexSeven.collectionDate'

  expect(CheckYourRecordPage.new.carrier_organisation_name_header(0)).to eq Translations.value 'contact.orgName'
  expect(CheckYourRecordPage.new.carrier_address_header(0)).to eq Translations.value 'address'
  expect(CheckYourRecordPage.new.carrier_country_header(0)).to eq Translations.value 'address.country'
  expect(CheckYourRecordPage.new.carrier_full_name_header(0)).to eq Translations.value 'contact.person'
  expect(CheckYourRecordPage.new.carrier_email_header(0)).to eq Translations.value 'contact.emailAddress'
  expect(CheckYourRecordPage.new.carrier_phone_header(0)).to eq Translations.value 'contact.phoneNumber'
  expect(CheckYourRecordPage.new.carrier_fax_header(0)).to eq Translations.value 'contact.faxNumber'

  expect(CheckYourRecordPage.new.carrier_type_header(0)).to eq Translations.value 'exportJourney.checkAnswers.transportOfWaste'
  expect(CheckYourRecordPage.new.carrier_transport_type(0)).to eq 'Road'
  expect(CheckYourRecordPage.new.carrier_transport_details(0)).to eq TestStatus.test_status(:road_description)

  # waste collection details
  expect(CheckYourRecordPage.new.waste_collection_address_header).to eq Translations.value 'address'
  expect(CheckYourRecordPage.new.waste_collection_country_header).to eq Translations.value 'address.country'
  expect(CheckYourRecordPage.new.waste_collection_organisation_header).to eq Translations.value 'contact.orgName'
  expect(CheckYourRecordPage.new.waste_collection_full_name_header).to eq Translations.value 'contact.person'
  expect(CheckYourRecordPage.new.waste_collection_email_header).to eq Translations.value 'contact.emailAddress'
  expect(CheckYourRecordPage.new.waste_collection_phone_header).to eq Translations.value 'contact.phoneNumber'
  # waste leaves uk

  expect(CheckYourRecordPage.new.exit_location_header).to eq Translations.value 'location'
  expect(CheckYourRecordPage.new.transit_countries_header).to eq Translations.value 'exportJourney.wasteTransitCountries.listTitle'

  # data check
  # collection-date
  expect(CheckYourRecordPage.new.collection_date).to eq HelperMethods.convert_date TestStatus.test_status(:actual_collection_date)
  # waste carrier
  expect(CheckYourRecordPage.new.carrier_organisation_name(0)).to eq TestStatus.test_status(:organisation_name)
  expect(CheckYourRecordPage.new.carrier_address(0)).to eq TestStatus.test_status(:address)
  expect(CheckYourRecordPage.new.carrier_country(0)).to eq TestStatus.test_status(:country)
  expect(CheckYourRecordPage.new.carrier_full_name(0)).to eq TestStatus.test_status(:organisation_contact)
  expect(CheckYourRecordPage.new.carrier_email(0)).to eq TestStatus.test_status(:email)
  expect(CheckYourRecordPage.new.carrier_phone(0)).to eq TestStatus.test_status(:phone_number)
  expect(CheckYourRecordPage.new.carrier_fax(0)).to eq Translations.value 'exportJourney.checkAnswers.notProvided'
  expect(CheckYourRecordPage.new.carrier_type(0)).to eq TestStatus.test_status(:waste_carrier_mode_of_transport)

  # collection details
  country, address = HelperMethods.address(TestStatus.test_status(:waste_collection_address))
  expect(CheckYourRecordPage.new.waste_collection_address.gsub("\n", ', ')).to eq address
  expect(CheckYourRecordPage.new.waste_collection_country).to eq country
  expect(CheckYourRecordPage.new.waste_collection_organisation).to eq TestStatus.test_status(:waste_contact_organisation_name)
  expect(CheckYourRecordPage.new.waste_collection_full_name).to eq TestStatus.test_status(:waste_contact_full_name)

  expect(CheckYourRecordPage.new.waste_collection_email).to eq TestStatus.test_status(:waste_contact_email)
  expect(CheckYourRecordPage.new.waste_collection_phone).to eq TestStatus.test_status(:phone_number)
  expect(CheckYourRecordPage.new.waste_collection_fax).to eq Translations.value 'exportJourney.checkAnswers.notProvided'
  expect(CheckYourRecordPage.new.exit_location).to eq TestStatus.test_status(:waste_leaves_UK_location)
  expect(CheckYourRecordPage.new.transit_countries).to eq TestStatus.countries_list[0]

end

And(/^I should see export Treatment of waste correctly displayed$/) do
  expect(CheckYourRecordPage.new.interimsite_org_name_title_0).to eq Translations.value 'exportJourney.interimSite.name'
  expect(CheckYourRecordPage.new.interimsite_address_title_0).to eq Translations.value 'address'
  expect(CheckYourRecordPage.new.interimsite_country_title_0).to eq Translations.value 'address.country'
  expect(CheckYourRecordPage.new.interimsite_contact_person_title_0).to eq Translations.value 'contact.person'
  expect(CheckYourRecordPage.new.interimsite_email_title_0).to eq Translations.value 'contact.emailAddress'
  expect(CheckYourRecordPage.new.interimsite_phone_title_0).to eq Translations.value 'contact.phoneNumber'
  expect(CheckYourRecordPage.new.interimsite_fax_title_0).to eq Translations.value 'contact.faxNumber'
  expect(CheckYourRecordPage.new.interimsite_code_title_0).to eq Translations.value 'exportJourney.recoveryFacilities.recoveryCode'

  expect(CheckYourRecordPage.new.interimsite_org_name_0).to eq TestStatus.test_status(:interim_site_name)
  expect(CheckYourRecordPage.new.interimsite_address_0).to eq TestStatus.test_status(:interim_site_address)
  expect(CheckYourRecordPage.new.interimsite_country_0).to eq TestStatus.test_status(:interim_site_country)
  expect(CheckYourRecordPage.new.interimsite_contact_person_0).to eq TestStatus.test_status(:interim_site_contact_full_name)
  expect(CheckYourRecordPage.new.interimsite_email_0).to eq TestStatus.test_status(:interim_site_contact_email)
  expect(CheckYourRecordPage.new.interimsite_phone_0).to eq TestStatus.test_status(:interim_site_contact_phone_number)
  expect(CheckYourRecordPage.new.interimsite_fax_0).to eq Translations.value 'exportJourney.checkAnswers.notProvided'
  expect(CheckYourRecordPage.new.interimsite_code_0).to eq TestStatus.test_status(:interim_site_recovery_code)

  # #Recovery facility
  expect(CheckYourRecordPage.new.recoveryfacility_org_name_title(0)).to eq Translations.value 'exportJourney.recoveryFacilities.name'
  expect(CheckYourRecordPage.new.recoveryfacility_address_title(0)).to eq Translations.value 'address'
  expect(CheckYourRecordPage.new.recoveryfacility_country_title(0)).to eq Translations.value 'address.country'
  expect(CheckYourRecordPage.new.recoveryfacility_contact_person_title(0)).to eq Translations.value 'contact.person'
  expect(CheckYourRecordPage.new.recoveryfacility_email_title(0)).to eq Translations.value 'contact.emailAddress'
  expect(CheckYourRecordPage.new.recoveryfacility_phone_title(0)).to eq Translations.value 'contact.phoneNumber'
  expect(CheckYourRecordPage.new.recoveryfacility_fax_title(0)).to eq Translations.value 'contact.faxNumber'
  expect(CheckYourRecordPage.new.recoveryfacility_code_title(0)).to eq Translations.value 'exportJourney.recoveryFacilities.recoveryCode'

  expect(CheckYourRecordPage.new.recoveryfacility_org_name(0)).to eq TestStatus.test_status(:recovery_facility_name)
  expect(CheckYourRecordPage.new.recoveryfacility_address(0)).to eq TestStatus.test_status(:recovery_facility_address)
  expect(CheckYourRecordPage.new.recoveryfacility_country(0)).to eq TestStatus.test_status(:rec_country)
  expect(CheckYourRecordPage.new.recoveryfacility_contact_person(0)).to eq TestStatus.test_status(:recovery_facility_full_name)

  expect(CheckYourRecordPage.new.recoveryfacility_email(0)).to eq TestStatus.test_status(:recovery_facility_email)
  expect(CheckYourRecordPage.new.recoveryfacility_phone(0)).to eq TestStatus.test_status(:recovery_facility_phone_number)
  expect(CheckYourRecordPage.new.recoveryfacility_fax(0)).to eq Translations.value 'exportJourney.checkAnswers.notProvided'
  expect(CheckYourRecordPage.new.recoveryfacility_code(0)).to eq TestStatus.test_status(:first_recovery_facility_code)

end

Then(/^I should see Estimate Collection date$/) do
  expect(CheckYourRecordPage.new.collection_date).to eq "Estimated #{HelperMethods.convert_date TestStatus.test_status(:estimate_collection_date)}"
end

And(/^I should see Estimate Quantity of Waste$/) do
  expect(CheckYourRecordPage.new.waste_quantity).to eq "Estimated #{TestStatus.test_status(:weight_quantity_in_tones)} #{TestStatus.test_status(:weight_units)}"
end

Then(/^I should see (\d+) waste carriers on check your export page$/) do |waste_carriers|
  (0...waste_carriers).each do |i|
    puts "checking for #{i}"
    within(CheckYourRecordPage.new.waste_carriers_list(i)) do
      # Waste carrier
      expect(CheckYourRecordPage.new.carrier_organisation_name_header(i)).to eq Translations.value 'contact.orgName'
      expect(CheckYourRecordPage.new.carrier_address_header(i)).to eq Translations.value 'address'
      expect(CheckYourRecordPage.new.carrier_country_header(i)).to eq Translations.value 'address.country'
      expect(CheckYourRecordPage.new.carrier_full_name_header(i)).to eq Translations.value 'contact.person'
      expect(CheckYourRecordPage.new.carrier_email_header(i)).to eq Translations.value 'contact.emailAddress'
      expect(CheckYourRecordPage.new.carrier_phone_header(i)).to eq Translations.value 'contact.phoneNumber'
      expect(CheckYourRecordPage.new.carrier_fax_header(i)).to eq Translations.value 'contact.faxNumber'
      expect(CheckYourRecordPage.new.carrier_type_header(i)).to eq Translations.value 'exportJourney.checkAnswers.transportOfWaste'
      expect(CheckYourRecordPage.new.carrier_transport_header(i)).to eq Translations.value 'exportJourney.checkAnswers.transportDetails'
      expect(CheckYourRecordPage.new.carrier_transport_details(i)).to eq TestStatus.test_status(:transport_description)

      # waste carrier
      expect(CheckYourRecordPage.new.carrier_organisation_name(i)).to eq TestStatus.waste_carrier_org_detail[i]
      expect(CheckYourRecordPage.new.carrier_address(i)).to eq TestStatus.waste_carrier_address[i]
      expect(CheckYourRecordPage.new.carrier_country(i)).to eq TestStatus.test_status(:country)
      expect(CheckYourRecordPage.new.carrier_full_name(i)).to eq TestStatus.test_status(:organisation_contact)
      expect(CheckYourRecordPage.new.carrier_email(i)).to eq TestStatus.test_status(:email)
      expect(CheckYourRecordPage.new.carrier_phone(i)).to eq TestStatus.test_status(:phone_number)
      expect(CheckYourRecordPage.new.carrier_fax(i)).to eq '12345678910'
      expect(CheckYourRecordPage.new.carrier_type(i)).to eq TestStatus.mode_of_travel_list_details[i]
    end
  end

end

And(/^I should see (\d+) ewc codes on check your export page$/) do |ewc_codes|
  expect(CheckYourRecordPage.new.ewc_codes_list.count).to eq TestStatus.ewc_code_list.size
  (0...ewc_codes).each do |i|
    description = TestData.get_ewc_code_description(TestStatus.ewc_code_list[i])
    expect(CheckYourRecordPage.new.ewc_codes_list[i].text.gsub(/\s+/, ' ').gsub(' *:', ':')).to eq "#{TestStatus.ewc_code_list[i].gsub(/(..)(?=.)/, '\1 ')}: #{description}"
  end
end

And(/^I should see (\d+) recovery facilities on check your export page$/) do |recover_facilities|
  (0...recover_facilities).each do |i|
    # #Recovery facility
    expect(CheckYourRecordPage.new.recoveryfacility_org_name_title(i)).to eq Translations.value 'exportJourney.recoveryFacilities.name'
    expect(CheckYourRecordPage.new.recoveryfacility_address_title(i)).to eq Translations.value 'address'
    expect(CheckYourRecordPage.new.recoveryfacility_country_title(i)).to eq Translations.value 'address.country'
    expect(CheckYourRecordPage.new.recoveryfacility_contact_person_title(i)).to eq Translations.value 'contact.person'
    expect(CheckYourRecordPage.new.recoveryfacility_email_title(i)).to eq Translations.value 'contact.emailAddress'
    expect(CheckYourRecordPage.new.recoveryfacility_phone_title(i)).to eq Translations.value 'contact.phoneNumber'
    expect(CheckYourRecordPage.new.recoveryfacility_fax_title(i)).to eq Translations.value 'contact.faxNumber'
    expect(CheckYourRecordPage.new.recoveryfacility_code_title(i)).to eq Translations.value 'exportJourney.recoveryFacilities.recoveryCode'
    #data
    recovery_facility = %w[1st 2nd 3rd 4th 5th]
    expect(CheckYourRecordPage.new.recoveryfacility_org_name(i)).to eq TestStatus.test_status("#{recovery_facility[i]}_recovery_facility_name".to_sym)
    expect(CheckYourRecordPage.new.recoveryfacility_address(i)).to eq TestStatus.test_status("#{recovery_facility[i]}_recovery_facility_address".to_sym)
    expect(CheckYourRecordPage.new.recoveryfacility_country(i)).to eq TestStatus.test_status("#{recovery_facility[i]}_recovery_facility_country".to_sym)
    expect(CheckYourRecordPage.new.recoveryfacility_contact_person(i)).to eq TestStatus.test_status("#{recovery_facility[i]}_recovery_facility_full_name".to_sym)

    expect(CheckYourRecordPage.new.recoveryfacility_email(i)).to eq TestStatus.test_status("#{recovery_facility[i]}_recovery_facility_email".to_sym)
    expect(CheckYourRecordPage.new.recoveryfacility_phone(i)).to eq TestStatus.test_status("#{recovery_facility[i]}_recovery_facility_phone_number".to_sym)
    expect(CheckYourRecordPage.new.recoveryfacility_fax(i)).to eq TestStatus.test_status("#{recovery_facility[i]}_recovery_facility_fax_number".to_sym)
    expect(CheckYourRecordPage.new.recoveryfacility_code(i)).to eq TestStatus.test_status(:first_recovery_facility_code)
  end
end

When(/^I click your own reference Change link$/) do
  CheckYourRecordPage.new.your_ref_change
end

When(/^I click waste code Change link$/) do
  CheckYourRecordPage.new.waste_code_type_change
end

When(/^I click ewc code Change link$/) do
  CheckYourRecordPage.new.ewc_code_change
end

When(/^I click national code Change link$/) do
  CheckYourRecordPage.new.national_code_change
end

When(/^I click Waste description Change link$/) do
  CheckYourRecordPage.new.waste_description_change
end

When(/^I click Waste quantity Change link$/) do
  CheckYourRecordPage.new.waste_quantity_change
end

When(/^I click Exporter address Change link$/) do
  CheckYourRecordPage.new.exporter_address_change
end

When(/^I click Exporter details Change link$/) do
  CheckYourRecordPage.new.exporter_organisation_name_change
end

Then(/^I should see selected EWC code on EWC codes page$/) do
  expect(EnterAnEwcCodePage.new).to have_text(TestStatus.test_status(:ewc_code).scan(/.{2}/).join(' '))
end

When(/^I click on Collection date Change link$/) do
  CheckYourRecordPage.new.collection_date_change
end

When(/^I click on Waste carrier Change link$/) do
  CheckYourRecordPage.new.carrier_change 0
end

When(/^I click on Waste carrier contact Change link$/) do
  CheckYourRecordPage.new.carrier_contact_details_change 0
end

When(/^I click the waste carrier transport Change link$/) do
  CheckYourRecordPage.new.carrier_type_change 0
end

When(/^I click waste carrier details Change link$/) do
  CheckYourRecordPage.new.carrier_details_change 0
end

Then(/^I click waste collection address Change link$/) do
  CheckYourRecordPage.new.waste_collection_address_change
end

When(/^I click waste collection contact change link$/) do
  CheckYourRecordPage.new.waste_collection_full_name_change
end

When(/^I click waste leaves location change link$/) do
  CheckYourRecordPage.new.exit_location_change
end

When(/^I click transit countries change link$/) do
  CheckYourRecordPage.new.transit_countries_change
end

Then(/^I should see warning text on check your report page$/) do
  CheckYourRecordPage.new.check_warning_text
end

And(/^I verify Change waste code page is translated correctly$/) do
  ChangeWasteCodePage.new.check_page_translation
end

And(/^I click Continue and change waste code button$/) do
  ChangeWasteCodePage.new.change_waste_code_button
end

And(/^I click Confirm all answers button$/) do
  CheckYourRecordPage.new.confirm_answers_button
end

And(/^I should see export Journey of waste with estimated collection date correctly displayed$/) do
  expect(CheckYourRecordPage.new.collection_date_header).to eq Translations.value 'exportJourney.submittedAnnexSeven.collectionDate'
  # Waste carrier
  expect(CheckYourRecordPage.new.carrier_organisation_name_header(0)).to eq Translations.value 'contact.orgName'
  expect(CheckYourRecordPage.new.carrier_address_header(0)).to eq Translations.value 'address'
  expect(CheckYourRecordPage.new.carrier_country_header(0)).to eq Translations.value 'address.country'
  expect(CheckYourRecordPage.new.carrier_full_name_header(0)).to eq Translations.value 'contact.person'
  expect(CheckYourRecordPage.new.carrier_email_header(0)).to eq Translations.value 'contact.emailAddress'
  expect(CheckYourRecordPage.new.carrier_phone_header(0)).to eq Translations.value 'contact.phoneNumber'
  expect(CheckYourRecordPage.new.carrier_fax_header(0)).to eq Translations.value 'contact.faxNumber'
  expect(CheckYourRecordPage.new.carrier_type_header(0)).to eq Translations.value 'exportJourney.checkAnswers.transportOfWaste'
  expect(CheckYourRecordPage.new.carrier_transport_header(0)).to eq Translations.value 'exportJourney.checkAnswers.transportDetails'

  # waste collection details
  expect(CheckYourRecordPage.new.waste_collection_address_header).to eq Translations.value 'address'
  expect(CheckYourRecordPage.new.waste_collection_country_header).to eq Translations.value 'address.country'
  expect(CheckYourRecordPage.new.waste_collection_organisation_header).to eq Translations.value 'contact.orgName'
  expect(CheckYourRecordPage.new.waste_collection_full_name_header).to eq Translations.value 'contact.person'
  expect(CheckYourRecordPage.new.waste_collection_email_header).to eq Translations.value 'contact.emailAddress'
  expect(CheckYourRecordPage.new.waste_collection_phone_header).to eq Translations.value 'contact.phoneNumber'
  # waste leaves uk

  expect(CheckYourRecordPage.new.exit_location_header).to eq Translations.value 'location'
  expect(CheckYourRecordPage.new.transit_countries_header).to eq Translations.value 'exportJourney.wasteTransitCountries.listTitle'

  # data check
  # collection-date
  collection_date = HelperMethods.convert_date TestStatus.test_status(:estimate_collection_date)
  expect(CheckYourRecordPage.new.collection_date).to eq "#{Translations.value 'exportJourney.checkAnswers.estimated'} #{collection_date}"
  # waste carrier
  expect(CheckYourRecordPage.new.carrier_organisation_name(0)).to eq TestStatus.test_status(:organisation_name)
  expect(CheckYourRecordPage.new.carrier_address(0)).to eq TestStatus.test_status(:address)
  expect(CheckYourRecordPage.new.carrier_country(0)).to eq TestStatus.test_status(:country)
  expect(CheckYourRecordPage.new.carrier_full_name(0)).to eq TestStatus.test_status(:organisation_contact)
  expect(CheckYourRecordPage.new.carrier_email(0)).to eq TestStatus.test_status(:email)
  expect(CheckYourRecordPage.new.carrier_phone(0)).to eq TestStatus.test_status(:phone_number)
  expect(CheckYourRecordPage.new.carrier_fax(0)).to eq Translations.value 'exportJourney.checkAnswers.notProvided'
  expect(CheckYourRecordPage.new.carrier_type(0)).to eq TestStatus.test_status(:waste_carrier_mode_of_transport)

  # collection details
  country, address = HelperMethods.address(TestStatus.test_status(:waste_collection_address))
  expect(CheckYourRecordPage.new.waste_collection_address.gsub("\n", ', ')).to eq address
  expect(CheckYourRecordPage.new.waste_collection_country).to eq country
  expect(CheckYourRecordPage.new.waste_collection_organisation).to eq TestStatus.test_status(:waste_contact_organisation_name)
  expect(CheckYourRecordPage.new.waste_collection_full_name).to eq TestStatus.test_status(:waste_contact_full_name)

  expect(CheckYourRecordPage.new.waste_collection_email).to eq TestStatus.test_status(:waste_contact_email)
  expect(CheckYourRecordPage.new.waste_collection_phone).to eq TestStatus.test_status(:phone_number)
  expect(CheckYourRecordPage.new.waste_collection_fax).to eq Translations.value 'exportJourney.checkAnswers.notProvided'
  expect(CheckYourRecordPage.new.exit_location).to eq TestStatus.test_status(:waste_leaves_UK_location)
  expect(CheckYourRecordPage.new.transit_countries).to eq TestStatus.countries_list[0]
end

When(/^I click importer details Change link$/) do
  CheckYourRecordPage.new.importer_details_change
end

When(/^I click importer contact details Change link$/) do
  CheckYourRecordPage.new.importer_contact_details_change
end

And(/^I should see interim side details on check your export page$/) do
  expect(CheckYourRecordPage.new.interimsite_org_name_title_0).to eq Translations.value 'exportJourney.interimSite.name'
  expect(CheckYourRecordPage.new.interimsite_address_title_0).to eq Translations.value 'address'
  expect(CheckYourRecordPage.new.interimsite_country_title_0).to eq Translations.value 'address.country'
  expect(CheckYourRecordPage.new.interimsite_contact_person_title_0).to eq Translations.value 'contact.person'
  expect(CheckYourRecordPage.new.interimsite_email_title_0).to eq Translations.value 'contact.emailAddress'
  expect(CheckYourRecordPage.new.interimsite_phone_title_0).to eq Translations.value 'contact.phoneNumber'
  expect(CheckYourRecordPage.new.interimsite_fax_title_0).to eq 'Fax number (optional)'
  expect(CheckYourRecordPage.new.interimsite_code_title_0).to eq 'Recovery code'

  expect(CheckYourRecordPage.new.interimsite_org_name_0).to eq TestStatus.test_status(:interim_site_name)
  expect(CheckYourRecordPage.new.interimsite_address_0).to eq TestStatus.test_status(:interim_site_address)
  expect(CheckYourRecordPage.new.interimsite_country_0).to eq TestStatus.test_status(:interim_site_country)
  expect(CheckYourRecordPage.new.interimsite_contact_person_0).to eq TestStatus.test_status(:interim_site_contact_full_name)
  expect(CheckYourRecordPage.new.interimsite_email_0).to eq TestStatus.test_status(:interim_site_contact_email)
  expect(CheckYourRecordPage.new.interimsite_phone_0).to eq TestStatus.test_status(:interim_site_contact_phone_number)
  expect(CheckYourRecordPage.new.interimsite_fax_0).to eq Translations.value 'exportJourney.checkAnswers.notProvided'
  expect(CheckYourRecordPage.new.interimsite_code_0).to eq 'R12: Exchange of wastes for submission to any of the operations numbered R01 to R11'
end

When(/^I click mode of transport details Change link$/) do
  CheckYourRecordPage.new.carrier_transport_details_change 0
end

And(/^I should see small waste export About the waste section correctly displayed$/) do
  expect(CheckYourRecordPage.new.waste_code_header).to eq 'Waste code'
  expect(CheckYourRecordPage.new.ewc_code_header).to eq 'EWC codes'
  expect(CheckYourRecordPage.new.national_code_header).to eq 'National code'
  expect(CheckYourRecordPage.new.waste_description_header).to eq 'Waste description'
  expect(CheckYourRecordPage.new.waste_quantity_header).to eq 'Waste quantity'

  expect(CheckYourRecordPage.new).to have_text TestStatus.test_status(:waste_code)
  description = TestData.get_ewc_code_description(TestStatus.test_status(:ewc_code))
  expect(CheckYourRecordPage.new.ewc_codes).to eq "#{TestStatus.test_status(:ewc_code).gsub(/(..)(?=.)/, '\1 ')}: #{description}"

  expect(CheckYourRecordPage.new.national_code).to eq TestStatus.test_status(:national_code_text)
  expect(CheckYourRecordPage.new.describe_the_waste).to eq TestStatus.test_status(:description_of_the_waste)
  expect(CheckYourRecordPage.new.waste_quantity).to eq "#{TestStatus.test_status(:weight_quantity_in_kgs)} #{TestStatus.test_status(:weight_units)}"
end

And(/^I should see Small waste export Journey of waste correctly displayed$/) do

  expect(CheckYourRecordPage.new.collection_date_header).to eq 'Collection date'
  # Waste carrier
  expect(CheckYourRecordPage.new.carrier_organisation_name_header(0)).to eq Translations.value 'contact.orgName'
  expect(CheckYourRecordPage.new.carrier_address_header(0)).to eq Translations.value 'address'
  expect(CheckYourRecordPage.new.carrier_country_header(0)).to eq Translations.value 'address.country'
  expect(CheckYourRecordPage.new.carrier_full_name_header(0)).to eq Translations.value 'contact.person'
  expect(CheckYourRecordPage.new.carrier_email_header(0)).to eq Translations.value 'contact.emailAddress'
  expect(CheckYourRecordPage.new.carrier_phone_header(0)).to eq Translations.value 'contact.phoneNumber'
  expect(CheckYourRecordPage.new.carrier_fax_header(0)).to eq 'Fax number (optional)'

  # waste collection details
  expect(CheckYourRecordPage.new.waste_collection_address_header).to eq Translations.value 'address'
  expect(CheckYourRecordPage.new.waste_collection_country_header).to eq Translations.value 'address.country'
  expect(CheckYourRecordPage.new.waste_collection_organisation_header).to eq Translations.value 'contact.orgName'
  expect(CheckYourRecordPage.new.waste_collection_full_name_header).to eq Translations.value 'contact.person'
  expect(CheckYourRecordPage.new.waste_collection_email_header).to eq Translations.value 'contact.emailAddress'
  expect(CheckYourRecordPage.new.waste_collection_phone_header).to eq Translations.value 'contact.phoneNumber'
  # waste leaves uk

  expect(CheckYourRecordPage.new.exit_location_header).to eq Translations.value 'location'
  expect(CheckYourRecordPage.new.transit_countries_header).to eq Translations.value 'exportJourney.wasteTransitCountries.listTitle'

  # data check
  # collection-date
  expect(CheckYourRecordPage.new.collection_date).to eq HelperMethods.convert_date TestStatus.test_status(:actual_collection_date)
  # waste carrier
  expect(CheckYourRecordPage.new.carrier_organisation_name(0)).to eq TestStatus.test_status(:organisation_name)
  expect(CheckYourRecordPage.new.carrier_address(0)).to eq TestStatus.test_status(:address)
  expect(CheckYourRecordPage.new.carrier_country(0)).to eq TestStatus.test_status(:country)
  expect(CheckYourRecordPage.new.carrier_full_name(0)).to eq TestStatus.test_status(:organisation_contact)
  expect(CheckYourRecordPage.new.carrier_email(0)).to eq TestStatus.test_status(:email)
  expect(CheckYourRecordPage.new.carrier_phone(0)).to eq TestStatus.test_status(:phone_number)
  expect(CheckYourRecordPage.new.carrier_fax(0)).to eq Translations.value 'exportJourney.checkAnswers.notProvided'

  # collection details
  country, address = HelperMethods.address(TestStatus.test_status(:waste_collection_address))
  expect(CheckYourRecordPage.new.waste_collection_address.gsub("\n", ', ')).to eq address
  expect(CheckYourRecordPage.new.waste_collection_country).to eq country
  expect(CheckYourRecordPage.new.waste_collection_organisation).to eq TestStatus.test_status(:waste_contact_organisation_name)
  expect(CheckYourRecordPage.new.waste_collection_full_name).to eq TestStatus.test_status(:waste_contact_full_name)

  expect(CheckYourRecordPage.new.waste_collection_email).to eq TestStatus.test_status(:waste_contact_email)
  expect(CheckYourRecordPage.new.waste_collection_phone).to eq TestStatus.test_status(:phone_number)
  expect(CheckYourRecordPage.new.waste_collection_fax).to eq Translations.value 'exportJourney.checkAnswers.notProvided'
  expect(CheckYourRecordPage.new.exit_location).to eq TestStatus.test_status(:waste_leaves_UK_location)
  expect(CheckYourRecordPage.new.transit_countries).to eq TestStatus.countries_list[0]
end

And(/^I should see small waste export Treatment of waste correctly displayed$/) do

  # Laboratory waste
  expect(CheckYourRecordPage.new).to have_text Translations.value 'exportJourney.checkAnswers.titleLaboratory'
  expect(CheckYourRecordPage.new.laboratory_name).to eq Translations.value 'exportJourney.laboratorySite.name'
  expect(CheckYourRecordPage.new.laboratory_address_title).to eq Translations.value 'address'
  expect(CheckYourRecordPage.new.laboratory_country_title).to eq Translations.value 'address.country'
  expect(CheckYourRecordPage.new.laboratory_contact_person_title).to eq Translations.value 'contact.person'
  expect(CheckYourRecordPage.new.laboratory_email_title).to eq Translations.value 'contact.emailAddress'
  expect(CheckYourRecordPage.new.laboratory_phone_title).to eq Translations.value 'contact.phoneNumber'
  expect(CheckYourRecordPage.new.laboratory_fax_title).to eq Translations.value 'contact.faxNumber'
  expect(CheckYourRecordPage.new.laboratory_code_title).to eq Translations.value 'exportJourney.checkAnswers.codeLaboratory'

  expect(CheckYourRecordPage.new.laboratory_org_name).to eq TestStatus.test_status(:laboratory_address_name)
  expect(CheckYourRecordPage.new.laboratory_address).to eq TestStatus.test_status(:laboratory_address_address)
  expect(CheckYourRecordPage.new.laboratory_country).to eq TestStatus.test_status(:laboratory_country)
  expect(CheckYourRecordPage.new.laboratory_contact_person).to eq TestStatus.test_status(:laboratory_contact_details_full_name)
  expect(CheckYourRecordPage.new.laboratory_email).to eq TestStatus.test_status(:laboratory_contact_details_email)
  expect(CheckYourRecordPage.new.laboratory_phone).to eq TestStatus.test_status(:laboratory_contact_details_phone_number)
  expect(CheckYourRecordPage.new.laboratory_fax).to eq TestStatus.test_status(:laboratory_contact_details_fax_number)
  expect(CheckYourRecordPage.new.laboratory_code).to eq TestStatus.test_status(:laboratory_disposal_code)

end

Then(/^I should see Not provided label on Check your record page$/) do
  expect(CheckYourRecordPage.new.carrier_transport_details(0)).to eq Translations.value 'exportJourney.checkAnswers.notProvided'
end

When(/^I click on Interim site address Change link$/) do
  CheckYourRecordPage.new.interim_site_address_change
end

When(/^I click on Interim site contact Change link$/) do
  CheckYourRecordPage.new.interim_site_contact_change
end

When(/^I click on Interim site recovery code Change link$/) do
  CheckYourRecordPage.new.interim_site_recovery_code_change
end

When(/^I click on Recovery facility address Change link$/) do
  CheckYourRecordPage.new.recovery_facility_address_change
end

When(/^I click on Recovery facility contact Change link$/) do
  CheckYourRecordPage.new.recovery_facility_contact_change
end

When(/^I click on Recovery facility code Change link$/) do
  CheckYourRecordPage.new.recovery_facility_recovery_code_change
end
