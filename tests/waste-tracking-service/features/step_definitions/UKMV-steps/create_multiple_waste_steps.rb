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
