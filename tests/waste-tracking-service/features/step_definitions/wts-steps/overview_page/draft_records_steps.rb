Then(/^I should see draft Annex VII records page$/) do
  DraftRecordsPage.new.check_page_displayed
end

And(/^I should see draft records page correctly translated$/) do
  DraftRecordsPage.new.check_page_translation
end

Then(/^I should see my draft application saved on the top$/) do
  expect(DraftRecordsPage.new.application_ref.text).to eq TestStatus.test_status(:application_reference_number)
end

And(/^I should see correct date on draft application page$/) do
  expect(DraftRecordsPage.new.export_date.text).to eq HelperMethods.current_date_format Date.today
end

And(/^I should see waste code on draft application page$/) do
  DraftRecordsPage.new.wait_for_text(TestStatus.test_status(:waste_code_description))
  expect(DraftRecordsPage.new.waste_code.text).to eq TestStatus.test_status(:waste_code_description)
end

Then(/^I should see empty draft Annex VII page$/) do
  expect(DraftRecordsPage.new).to have_text Translations.value 'exportJourney.incompleteAnnexSeven.notResultsMessage'
end

Then(/^I should see pagination when exports are more than 15$/) do
  if DraftRecordsPage.new.export_count - 1 > 15
    expect(DraftRecordsPage.new.next_link.text).to eq Translations.value 'nextPage'
    DraftRecordsPage.new.click_next_link
    Log.info 'Successfully tested pagination in the Run'
    DraftRecordsPage.new.click_previous_link
  end
end
