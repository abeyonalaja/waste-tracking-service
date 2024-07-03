And(/^I verify create multiple waste page is correctly translated$/) do
  UkwmCreateMultipleWastePage.new.check_page_translation
end

And(/^I click on guidance link$/) do
  click_link(href: '/move-waste/en/multiples/guidance', match: :first)
  switch_to_window(windows.last)
end

And(/^I verify interruption page is correctly translated$/) do
  UkwmInterruptionPage.new.check_page_translation
end

And(/^I verify guidance page is translated correctly$/) do
  UkwmUserGuidancePage.new.check_page_translation
end

And(/^I upload valid ukwm csv$/) do
  CreateMultipleRecordsPage.new.upload_file 'VALID_UKWM_CSV'
end

Then(/^I wait for the upload to finish$/) do
  GlwUploadSuccessPage.new.wait_to_upload
end

Then(/^Bulk upload success page is displayed for "([^"]*)" records$/) do |records|
  UkwmUploadSuccessPage.new.check_page_displayed records
end

And(/^I verify Bulk upload success page is correctly translated for "([^"]*)" records$/) do |records|
  UkwmUploadSuccessPage.new.check_page_translation records
end

Then(/^Bulk confirmation page is displayed for "([^"]*)" movements$/) do |movements|
  UkwmBulkConfirmationPage.new.check_page_displayed movements
end

And(/^I verify Bulk confirmation page is correctly translated$/) do
  UkwmBulkConfirmationPage.new.check_page_translation
end

And(/^I click Continue and create button$/) do
  UkwmUploadSuccessPage.new.continue_and_create
end

And(/^I click Cancel submission button$/) do
  UkwmUploadSuccessPage.new.cancel_button
end

And(/^I verify cancel page is translated correctly$/) do
  UkwmCancelPage.new.check_page_translation
end

And(/^I click confirm and cancel button$/) do
  UkwmCancelPage.new.cancel_button
end

And(/^I click continue to create records$/) do
  UkwmCancelPage.new.create_button
end

And(/^I click return Return to move waste in the UK button$/) do
  UkwmBulkConfirmationPage.new.return_button
end

And(/^I upload ukwm "([^"]*)" csv$/) do |file_name|
  CreateMultipleRecordsPage.new.upload_with_filename file_name
end

When(/^I wait for the submission to finish$/) do
  GlwUploadSuccessPage.new.wait_to_submission
end

And(/^I upload invalid ukwm csv$/) do
  CreateMultipleRecordsPage.new.upload_file 'INVALID_UKWM'
end

Then(/^Bulk upload ukwm error is displayed for "([^"]*)" records$/) do |errors|
  UkwmErrorSummaryPage.new.check_page_displayed(errors)
end

Then(/^I see ukwm summary page correctly translated$/) do
  UkwmErrorSummaryPage.new.check_page_translation
end

And(/^I should see (\d+) column error details correctly displayed for "([^"]*)" csv$/) do |error_column_count, _file_path|
  expect(UkwmErrorSummaryPage.new.by_column_error_count).to eq error_column_count
end

And(/^I should see (\d+) row error details correctly displayed$/) do |row|
  (0..row - 1).each do |i|
    UkwmErrorSummaryPage.new.rows_action(i)
  end
end

Then(/^I should see column error details correctly displayed for "([^"]*)" csv$/) do |file_name|
  actual_column_errors_json = UkwmErrorSummaryPage.new.column_errors
  puts actual_column_errors_json

  actual_column_errors_json = UkwmErrorSummaryPage.new.convert_to_json(actual_column_errors_json)
  actual_column_errors_json = UkwmErrorSummaryPage.new.parse_json(actual_column_errors_json)
  yaml_file_path = "#{File.dirname(__FILE__)}/../../data/UKM/expected_errors/column_errors/#{file_name}.yml"
  expected_column_errors = UkwmErrorSummaryPage.new.load_yaml(yaml_file_path)
  expect(UkwmErrorSummaryPage.new.compare_data(expected_column_errors, actual_column_errors_json)).to eq true
end

When(/^I wait for the error page to load$/) do
  GlwUploadSuccessPage.new.wait_to_error_page
end

When(/^I click UKM errors by rows$/) do
  GlwUploadErrorPage.new.errors_by_row.click
end

Then(/^I should see row error details correctly displayed for "([^"]*)"$/) do |file_name|
  actual_row_errors_json = UkwmErrorSummaryPage.new.row_errors
  puts actual_row_errors_json
  actual_row_errors_json = UkwmErrorSummaryPage.new.convert_to_json(actual_row_errors_json)
  actual_row_errors_json = UkwmErrorSummaryPage.new.parse_json(actual_row_errors_json)
  yaml_file_path = "#{File.dirname(__FILE__)}/../../data/UKM/expected_errors/row_errors/#{file_name}.yml"
  expected_row_errors = UkwmErrorSummaryPage.new.load_yaml(yaml_file_path)
  expect(UkwmErrorSummaryPage.new.compare_data(expected_row_errors, actual_row_errors_json)).to eq true
end

Then(/^Waste movement records list page$/) do
  WasteMovementRecordsListPage.new.check_page_displayed
end

And(/^I can view all the 40 records in 3 pagination pages$/) do
  expect(WasteMovementRecordsListPage.new.export_count).to eq 15
  expect(WasteMovementRecordsListPage.new.next_link.text).to eq "Next\npage"
  WasteMovementRecordsListPage.new.click_next_link
  expect(WasteMovementRecordsListPage.new.export_count).to eq 15
  WasteMovementRecordsListPage.new.click_next_link
  expect(WasteMovementRecordsListPage.new.export_count).to eq 10
  WasteMovementRecordsListPage.new.click_previous_link
  expect(WasteMovementRecordsListPage.new.export_count).to eq 15
  Log.info 'Successfully tested UKM pagination in the Run'
end

And(/^I can see the header columns on the UKM list page correctly displayed$/) do
  expect(WasteMovementRecordsListPage.new.header_columns.count).to eq 5
  expect(WasteMovementRecordsListPage.new.header_columns[0].text).to eq 'Waste movement ID'
  expect(WasteMovementRecordsListPage.new.header_columns[1].text).to eq 'Collection date'
  expect(WasteMovementRecordsListPage.new.header_columns[2].text).to eq 'EWC code'
  expect(WasteMovementRecordsListPage.new.header_columns[3].text).to eq 'Producer name'
  expect(WasteMovementRecordsListPage.new.header_columns[4].text).to eq 'Action'
end

And(/^I see waste movement records list page translated$/) do
  WasteMovementRecordsListPage.new.check_page_translation
end

And(/^I click show all sections$/) do
  WasteMovementRecordsListPage.new.click_show_all_sections
end

Then(/^Bulk upload success page is displayed for one record$/) do
  UkwmUploadSuccessPage.new.check_page_displayed_1_record
end

And(/^I click View link for the first record$/) do
  click_link('row-WM2407_B5AA6454-view-link')
end

And(/^I can see all the details from the uploaded record$/) do
  click_button 'show-hide-button'
  expect(UkwmSingleRecordPage.new.waste_description_label).to eq 'Waste description'
  expect(UkwmSingleRecordPage.new.waste_description_value).to eq 'Circuit boards; Batteries (lithium-ion); Display screens; Plastic casings'
  expect(UkwmSingleRecordPage.new.physical_form_label).to eq 'Physical form'
  expect(UkwmSingleRecordPage.new.physical_form_value).to eq 'Gas'
  expect(UkwmSingleRecordPage.new.waste_quantity_label).to eq 'Waste quantity'
  expect(UkwmSingleRecordPage.new.waste_quantity_value).to eq "Estimated\n1.1tonnes"
  expect(UkwmSingleRecordPage.new.chemical_biological_label).to eq 'Chemical and biological components of waste'
  expect(UkwmSingleRecordPage.new.chemical_biological_value).to eq '20.35mg/kg Chlorinated solvents'
  expect(UkwmSingleRecordPage.new.hazardous_properties_label).to eq 'Hazardous properties'
  expect(UkwmSingleRecordPage.new.hazardous_properties_value).to eq 'Yes'
  expect(UkwmSingleRecordPage.new.hazardous_waste_codes_label).to eq 'Hazardous waste codes'
  expect(UkwmSingleRecordPage.new.hazardous_waste_codes_value).to eq 'HP1: Explosive'
  expect(UkwmSingleRecordPage.new.pops_label).to eq 'Persistent organic pollutants (POPs)'
  expect(UkwmSingleRecordPage.new.pops_value).to eq 'Yes'
  expect(UkwmSingleRecordPage.new.pops_details_label).to eq 'Persistent organic pollutants (POPs) details'
  expect(UkwmSingleRecordPage.new.pops_details_value).to eq 'Endosulfan'
  expect(UkwmSingleRecordPage.new.pops_concentration_label).to eq 'Persistent organic pollutants (POPs) concentration value'
  expect(UkwmSingleRecordPage.new.pops_concentration_value).to eq '9823.75mg/k'
  expect(UkwmSingleRecordPage.new.transportation_containers_label).to eq 'Number and type of transportation containers'
  expect(UkwmSingleRecordPage.new.transportation_containers_value).to eq '123456'
  expect(UkwmSingleRecordPage.new.special_handling_label).to eq 'Special handling requirements details'
  expect(UkwmSingleRecordPage.new.special_handling_value).to eq 'Not provided'
  expect(UkwmSingleRecordPage.new.producer_org_name_label).to eq 'Producer organisation name'
  expect(UkwmSingleRecordPage.new.producer_org_name_value).to eq 'Producer org name2'
  expect(UkwmSingleRecordPage.new.producer_address_label).to eq 'Producer address'
  expect(UkwmSingleRecordPage.new.producer_address_value).to eq "110 Bishopsgate\nLondon\nCV12RD\nWales"
  expect(UkwmSingleRecordPage.new.producer_contact_name_label).to eq 'Producer contact name'
  expect(UkwmSingleRecordPage.new.producer_contact_name_value).to eq 'Pro Name'
  expect(UkwmSingleRecordPage.new.producer_contact_email_label).to eq 'Producer contact email address'
  expect(UkwmSingleRecordPage.new.producer_contact_email_value).to eq 'guy@test.com'
  expect(UkwmSingleRecordPage.new.producer_contact_phone_label).to eq 'Producer contact phone number'
  expect(UkwmSingleRecordPage.new.producer_contact_phone_value).to eq '00447811111213'
  expect(UkwmSingleRecordPage.new.producer_sic_code_label).to eq 'Producer Standard Industrial Classification (SIC) code'
  expect(UkwmSingleRecordPage.new.producer_sic_code_value).to eq '208016'
  expect(UkwmSingleRecordPage.new.waste_collection_address_label).to eq 'Waste collection address'
  expect(UkwmSingleRecordPage.new.waste_collection_address_value).to eq "110 Bishopsgate\nLondon\n\nScotland"
  expect(UkwmSingleRecordPage.new.local_authority_label).to eq 'Local authority'
  expect(UkwmSingleRecordPage.new.local_authority_value).to eq 'Hartlepool'
  expect(UkwmSingleRecordPage.new.waste_source_label).to eq 'Waste source'
  expect(UkwmSingleRecordPage.new.waste_source_value).to eq 'Household'
  expect(UkwmSingleRecordPage.new.broker_registration_num_label).to eq 'Broker registration number'
  expect(UkwmSingleRecordPage.new.broker_registration_num_value).to eq 'Not provided'
  expect(UkwmSingleRecordPage.new.carrier_org_name_label).to eq 'Carrier organisation name'
  expect(UkwmSingleRecordPage.new.carrier_org_name_value).to eq 'Producer org name'
  expect(UkwmSingleRecordPage.new.carrier_address_label).to eq 'Carrier address'
  expect(UkwmSingleRecordPage.new.carrier_address_value).to eq "110 Bishopsgate\nMulberry street\nLondon\nCV12RD\nWales"
  expect(UkwmSingleRecordPage.new.carrier_contact_name_label).to eq 'Carrier contact name'
  expect(UkwmSingleRecordPage.new.carrier_contact_name_value).to eq 'Pro Name'
  expect(UkwmSingleRecordPage.new.carrier_contact_email_label).to eq 'Carrier contact email address'
  expect(UkwmSingleRecordPage.new.carrier_contact_email_value).to eq 'guy@test.com'
  expect(UkwmSingleRecordPage.new.carrier_contact_phone_label).to eq 'Carrier contact phone number'
  expect(UkwmSingleRecordPage.new.carrier_contact_phone_value).to eq '00447811111213'
  expect(UkwmSingleRecordPage.new.receiver_authorisation_label).to eq 'Receiver authorisation type'
  expect(UkwmSingleRecordPage.new.receiver_authorisation_value).to eq 'Permit DEFRA'
  expect(UkwmSingleRecordPage.new.receiver_permit_number_label).to eq 'Receiver permit number or waste exemption number'
  expect(UkwmSingleRecordPage.new.receiver_permit_number_value).to eq 'DEFRA 1235'
  expect(UkwmSingleRecordPage.new.receiver_org_name_label).to eq 'Receiver organisation name'
  expect(UkwmSingleRecordPage.new.receiver_org_name_value).to eq 'Mac Donald \'s'
  expect(UkwmSingleRecordPage.new.receiver_address_label).to eq 'Receiver address'
  expect(UkwmSingleRecordPage.new.receiver_address_value).to eq "12 Mulberry Street\nWest coast\nDA112AB\nWales"
  expect(UkwmSingleRecordPage.new.receiver_postcode_label).to eq 'Receiver postcode'
  expect(UkwmSingleRecordPage.new.receiver_postcode_value).to eq 'DA112AB'
  expect(UkwmSingleRecordPage.new.receiver_contact_name_label).to eq 'Receiver contact name'
  expect(UkwmSingleRecordPage.new.receiver_contact_name_value).to eq 'Mr. Smith Jones'
  expect(UkwmSingleRecordPage.new.receiver_contact_email_label).to eq 'Receiver contact email address'
  expect(UkwmSingleRecordPage.new.receiver_contact_email_value).to eq 'smithjones@hotmail.com'
  expect(UkwmSingleRecordPage.new.receiver_contact_phone_label).to eq 'Receiver contact phone number'
  expect(UkwmSingleRecordPage.new.receiver_contact_phone_value).to eq '07811111111'
end

Then(/^Bulk confirmation page is displayed for one movement record$/) do
  UkwmBulkConfirmationPage.new.check_page_displayed_for_1_record
end
