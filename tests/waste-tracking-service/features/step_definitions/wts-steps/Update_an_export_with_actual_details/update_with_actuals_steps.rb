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
