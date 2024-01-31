And(/^I navigate to upload glw csv$/) do
  click_link Translations.value('exportJourney.exportHome.createMultipleRecords')
  CreateMultipleRecordsPage.new.check_page_displayed
end

When(/^I upload valid glw csv$/) do
  CreateMultipleRecordsPage.new.upload_file 'VALID'
end

Then(/^I should see glw csv is successfully uploaded$/) do
  GlwUploadSuccessPage.new.check_page_displayed
end

When(/^I upload invalid glw csv$/) do
  CreateMultipleRecordsPage.new.upload_file 'INVALID'
end

And(/^I should see glw csv error page correctly translated$/) do
  GlwUploadErrorPage.new.check_page_translation
end

And(/^I should see glw csv error page with (\d+) errors$/) do |no_of_errors|
  expect(GlwUploadErrorPage.new.csv_error_count).to eq no_of_errors
end

And(/^I should see glw error details for (\d+) errors$/) do |count|
  (0...count).each do |i|
    row_number = GlwUploadErrorPage.new.get_error_row_number_at_index(i)
    error_amount = GlwUploadErrorPage.new.get_error_count_at_index(i)
    GlwUploadErrorPage.new.click_csv_view_error_details_link(i)
    GlwUploadErrorDetailsPage.new.check_page_displayed row_number, error_amount
    GlwUploadErrorDetailsPage.new.return_to_error_summary_table
  end
end

Then(/^I should see glw csv is successfully uploaded with no errors$/) do
  GlwUploadSuccessPage.new.check_csv_with_no_error_displayed
end

Then(/^I should see glw csv error page is displayed$/) do
  GlwUploadErrorPage.new.check_page_displayed
end

Then(/^I should see glw csv error page is displayed with (\d+) errors$/) do |error_count|
  GlwUploadErrorPage.new.check_page_errors error_count
end

When(/^I navigate to glw csv error row (\d+)$/) do |row|
  GlwUploadErrorPage.new.click_csv_view_error_details_link(row - 1)
end

Then(/^I should see glw csv guidance page link$/) do
  expect(GlwUploadErrorDetailsPage.new).to have_link('how to create multiple Annex VII records using the CSV template (opens in new tab)')
end
