And(/^I click Return to export waste from UK button$/) do
  click_link('Return to export waste from the UK')
end

And(/^I can see Update with actual page correctly translated$/) do
  UpdateWithActualPage.new.check_page_displayed
end

Then(/^I verify that newly created record is on top of the table$/) do
  expect(UpdateWithActualPage.new.application_ref.text).to eq TestStatus.test_status(:application_reference_number)
end

And(/^I verify reference section is filled with 'Not provided'$/) do
  expect(UpdateWithActualPage.new.application_ref.text).to eq TestStatus.test_status(:application_reference_number)
end

And(/^I see message that there are no exports with estimates$/) do
  UpdateWithActualPage.new.check_page_displayed_no_exports
end

And(/^I should see correct date and waste code and transaction reference$/) do
  expect(UpdateWithActualPage.new.export_date.text).to eq HelperMethods.current_date_format Date.today
  expect(UpdateWithActualPage.new.transaction_number.text).to eq TestStatus.test_status(:export_transaction_number)
  expect(UpdateWithActualPage.new.waste_code.text).to eq TestStatus.test_status(:waste_code_description)
end

When(/^I click the first update link$/) do
  UpdateWithActualPage.new.first_update_link
end

When(/^I click update estimated quantity of waste$/) do
  UpdateWithActualPage.new.update_quantity_of_waste
end

And(/^I expand About the waste section$/) do
  UpdateWithActualPage.new.expand_about_waste
end

Then(/^I should see quantity of actual waste updated in tonnes$/) do
  expect(CheckYourReportPage.new.waste_quantity).to eq "#{TestStatus.test_status(:weight_in_tonnes)} #{TestStatus.test_status(:weight_units)}"
end

Then(/^I should see success message translated correctly$/) do
  expect(UpdateWithActualPage.new.success_title.text).to eq 'Success'
  expect(UpdateWithActualPage.new.success_body.text).to eq 'Your record has been updated'
end

Then(/^I should see quantity of actual waste updated in cubic meters$/) do
  expect(CheckYourReportPage.new.waste_quantity).to eq "#{TestStatus.test_status(:weight_in_cubic_meters)} m3"
end

Then(/^I should see quantity of actual waste updated in kilograms$/) do
  expect(CheckYourReportPage.new.waste_quantity).to eq "#{TestStatus.test_status(:weight_in_kilograms)} kg"
end

And(/^I should see the transaction number on update estimate page$/) do
  expect(UpdateWithActualPage.new.transaction_id.text).to eq "Transaction number: #{TestStatus.test_status(:export_transaction_number)}"
end
