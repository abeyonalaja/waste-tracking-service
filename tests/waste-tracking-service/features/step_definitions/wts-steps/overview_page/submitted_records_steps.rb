And(/^I should see submitted records page is correctly translated$/) do
  SubmittedRecordsPage.new.check_page_translation
end

And(/^I should see correct collection date and waste code and transaction reference$/) do
  expect(UpdateWithActualPage.new.export_date.text).to eq HelperMethods.convert_date_to_short_month TestStatus.test_status(:actual_collection_date)
  expect(UpdateWithActualPage.new.transaction_number.text).to eq TestStatus.test_status(:export_transaction_number)
  expect(UpdateWithActualPage.new.waste_code.text).to eq TestStatus.test_status(:waste_code_description)
end

When(/^I click the first view link$/) do
  SubmittedRecordsPage.new.first_view_link
end

And(/^I can view submitted export transaction number$/) do
  sleep 2
  expect(SingleSubmittedExportPage.new.transaction_number.text).to eq "Transaction number: #{TestStatus.test_status(:export_transaction_number)}"
end

Then(/^I should see view submitted export page correctly translated$/) do
  ViewSubmittedExportPage.new.check_page_translation
end
