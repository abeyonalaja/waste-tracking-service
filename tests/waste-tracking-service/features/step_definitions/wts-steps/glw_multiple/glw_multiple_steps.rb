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

Then(/^I should see glw csv error page with error details$/) do
  GlwUploadErrorPage.new.check_page_displayed
end

And(/^I should see glw error details are correctly displayed$/) do
  GlwUploadErrorPage.new.check_page_errors
end
