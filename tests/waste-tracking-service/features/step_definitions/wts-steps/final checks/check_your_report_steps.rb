And(/^I should see check your report page is correctly translated$/) do
  CheckYourReportPage.new.check_page_translation
end

And(/^I should see export reference correctly displayed$/) do
  CheckYourReportPage.new.check_export_reference
end
