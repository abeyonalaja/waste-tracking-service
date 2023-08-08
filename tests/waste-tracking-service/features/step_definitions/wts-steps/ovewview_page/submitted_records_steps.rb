And(/^I should see submitted records page is correctly translated$/) do
  SubmittedRecordsPage.new.check_page_translation
end

And(/^I should see correct collection date and waste code and transaction reference$/) do
  expect(UpdateWithActualPage.new.export_date.text).to eq HelperMethods.convert_date TestStatus.test_status(:actual_collection_date)
  expect(UpdateWithActualPage.new.transaction_number.text).to eq TestStatus.test_status(:export_transaction_number)
  expect(UpdateWithActualPage.new.waste_code.text).to eq TestStatus.test_status(:waste_code_description)
end
