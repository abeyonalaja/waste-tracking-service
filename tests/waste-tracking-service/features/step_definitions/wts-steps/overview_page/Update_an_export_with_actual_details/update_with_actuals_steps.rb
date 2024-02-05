And(/^I can see Update with actual page correctly translated$/) do
  UpdateWithActualPage.new.check_translation
end

Then(/^I verify that newly created record is on top of the table$/) do
  expect(UpdateWithActualPage.new.application_ref.text).to eq TestStatus.test_status(:application_reference_number)
end

And(/^I verify reference section is filled with reference$/) do
  expect(UpdateWithActualPage.new.application_ref.text).to eq TestStatus.test_status(:application_reference_number)
end

And(/^I see message that there are no exports with estimates$/) do
  UpdateWithActualPage.new.check_page_displayed_no_exports
end

And(/^I should see correct date and waste code and transaction reference$/) do
  HelperMethods.wait_for_a_sec
  expect(UpdateWithActualPage.new.application_ref.text).to eq TestStatus.test_status(:application_reference_number)
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
  expect(CheckYourRecordPage.new.waste_quantity).to eq "#{TestStatus.test_status(:weight_in_tonnes)} #{TestStatus.test_status(:weight_units)}"
end

Then(/^I should see success message translated correctly$/) do
  expect(UpdateWithActualPage.new.success_title.text).to eq 'Success'
  expect(UpdateWithActualPage.new.success_body.text).to eq Translations.value 'exportJourney.updateActualQuantity.success'
end

Then(/^I should see quantity of actual waste updated in cubic meters$/) do
  expect(CheckYourRecordPage.new.waste_quantity).to eq "#{TestStatus.test_status(:weight_in_cubic_meters)} m3"
end

Then(/^I should see quantity of actual waste updated in kilograms$/) do
  expect(CheckYourRecordPage.new.waste_quantity).to eq "#{TestStatus.test_status(:weight_in_kilograms)} kg"
end

And(/^I should see the transaction number on update estimate page$/) do
  expect(UpdateWithActualPage.new.transaction_id.text).to eq "#{Translations.value 'exportJourney.updateAnnexSeven.delete.caption'}#{TestStatus.test_status(:export_transaction_number)}"
end

And(/^I verify update annex record page is correctly translated$/) do
  UpdateAnnexRecordPage.new.check_translation
end

Then(/^I click show all sections link$/) do
  find('check-answers-accordion-toggle-all-text').click
end

And(/^I verify hide all sections link is now visible$/) do
  expect(page).to have_text('Hide all sections') # no transl value
end

And(/^I verify that estimated warning message is not present on the page$/) do
  UpdateAnnexRecordPage.new.no_estimate_warning_message
end

And(/^I verify Actual needed labels are present on the page$/) do
  expect(UpdateAnnexRecordPage.new.waste_quantity_label).to eq (Translations.value 'status.actualNeeded').upcase
  expect(UpdateAnnexRecordPage.new.collection_date_label).to eq (Translations.value 'status.actualNeeded').upcase
end

And(/^I should see actual collection date correctly translated$/) do
  ActualCollectionDatePage.new.check_translation
end

And(/^I should see actual collection date correctly displayed$/) do
  expect(CheckYourRecordPage.new.collection_date).to eq HelperMethods.convert_date TestStatus.test_status(:actual_collection_date)
end

Then(/^Export update submitted page displayed$/) do
  ExportUpdateSubmissionConfirmationPage.new.check_page_displayed
end

And(/^I should see export update submitted page correctly translated$/) do
  ExportUpdateSubmissionConfirmationPage.new.check_page_translation
end

And(/^I should see the transaction number remains same$/) do
  expect(ExportUpdateSubmissionConfirmationPage.new.transaction_id.text).to eq TestStatus.test_status(:export_transaction_number)
end

When(/^I click the update collection date link$/) do
  UpdateWithActualPage.new.second_update_link
end

When(/^I click first cancel button$/) do
  UpdateWithActualPage.new.first_cancel_link
end

And(/^I should see cancel the export page correctly translated$/) do
  CancelTheExportPage.new.check_page_translation
end

And(/^I should see Success cancelled message$/) do
  expect(UpdateWithActualPage.new.success_title.text).to eq 'Success'
  expect(UpdateWithActualPage.new.cancel_notification).to eq "#{TestStatus.test_status(:application_reference_number)} #{Translations.value('exportJourney.updateAnnexSeven.delete.notificationRef')}"
end

And(/^I should not see cancelled export on update with actual page$/) do
  expect(UpdateWithActualPage.new.transaction_number.text).not_to eq "#{TestStatus.test_status(:export_transaction_number)}"
end

When(/^I enter a valid cancellation reason$/) do
  reason = "Don't need the export any more"
  UpdateWithActualPage.new.update_reason reason
end

And(/^I should see cancelled export on update with actual page$/) do
  expect(UpdateWithActualPage.new.transaction_number.text).to eq "#{TestStatus.test_status(:export_transaction_number)}"
end

When(/^I enter a reason more than 100 character$/) do
  reason = Faker::Base.regexify(%r{[a-zA-Z0-9]{130}})
  UpdateWithActualPage.new.update_reason reason
end

Then(/^I should not see updated with actual exports on update with actual page$/) do
  expect(UpdateWithActualPage.new.transaction_number.text).not_to eq "#{TestStatus.test_status(:export_transaction_number)}"
end

And(/^I should see update collection date and waste code and transaction reference$/) do
  HelperMethods.wait_for_a_sec
  expect(UpdateWithActualPage.new.export_date.text).to eq HelperMethods.convert_date_to_short_month TestStatus.test_status(:actual_collection_date)
  expect(UpdateWithActualPage.new.transaction_number.text).to eq TestStatus.test_status(:export_transaction_number)
  expect(UpdateWithActualPage.new.waste_code.text).to eq TestStatus.test_status(:waste_code_description)
end
