And(/^I can see page translated correctly for bulk waste$/) do
  SignDeclarationPage.new.check_page_translation_bulk
end

And(/^I click confirm and submit button$/) do
  SignDeclarationPage.new.confirm_submit_button
end

Then(/^Export submitted page displayed$/) do
  ExportSubmissionConfirmationPage.new.check_page_displayed
  TestStatus.set_test_status(:export_transaction_number, ExportSubmissionConfirmationPage.new.transaction_number.text)
end

And(/^I can see page translated correctly for small waste$/) do
  SignDeclarationPage.new.check_page_translation_small
end

And(/^I should see export submitted page is correctly translated$/) do
  ExportSubmissionConfirmationPage.new.check_page_translation
end

Then(/^I should see export submitted page with estimates correctly translated$/) do
  ExportSubmissionConfirmationPage.new.check_page_translation_estimates
end

And(/^I should see actual details export submitted page is correctly translated$/) do
  ExportSubmissionConfirmationPage.new.check_page_translation
end
