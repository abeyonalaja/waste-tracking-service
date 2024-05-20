And(/^I verify create multiple waste page is correctly translated$/) do
  UkwmCreateMultipleWastePage.new.check_page_translation
end

And(/^I click on guidance link$/) do
  click_link(href: '/move-waste/en/multiples/guidance', :match => :first)
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

Then(/^Bulk upload success page is displayed for "([^"]*)" records$/) do |records|
  sleep 10
  UkwmUploadSuccessPage.new.check_page_displayed records
end

And(/^I verify Bulk upload success page is correctly translated for "([^"]*)" records$/) do |records|
  UkwmUploadSuccessPage.new.check_page_translation records
end

Then(/^Bulk confirmation page is displayed for "([^"]*)" movements$/) do |movements|
  sleep 10
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
