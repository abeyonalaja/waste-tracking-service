And(/^I click delete link for the first record on the page$/) do
  DraftRecordsPage.new.click_first_delete_link
end

And(/^I click confirm button$/) do
  ConfirmationDeleteAnnexRecordPage.new.confirm_button
end

And(/^I verify record is not present on the page$/) do
  expect(DraftRecordsPage.new.your_own_reference).not_to eq TestStatus.test_status(:application_reference_number)
end

And(/^I verify success message does not contain reference number$/) do
  expect(DraftRecordsPage.new.delete_notification).to eq "#{TestStatus.test_status(:application_reference_number)} #{Translations.value('exportJourney.incompleteAnnexSeven.delete.notificationRef')}"
end

And(/^I verify record is present on the page$/) do
  expect(DraftRecordsPage.new.your_own_reference).to eq TestStatus.test_status(:application_reference_number)
end

And(/^I verify that correct success message is displayed$/) do
  expect(DraftRecordsPage.new.delete_notification).to eq "#{TestStatus.test_status(:application_reference_number)} #{Translations.value('exportJourney.incompleteAnnexSeven.delete.notificationRef')}"
end

And(/^I verify reference caption is present$/) do
  ConfirmationDeleteAnnexRecordPage.new.check_reference_caption
end
