Then(/^Submit an export page is displayed$/) do
  SubmitAnExportPage.new.check_page_displayed
end

And(/^the reference should be displayed$/) do
  expect(SubmitAnExportPage.new.reference_number.text).to eq("Your reference: #{TestStatus.test_status(:application_reference_number)}")
end

When(/^I navigate to the submit an export with reference$/) do
  click_link('Green list waste overview')
  OverviewPage.new.submit_a_single_waste_export
  AddReferenceNumberController.complete
end

Then(/^I have submission incomplete 0 of 4 sections$/) do
  expect(page).to have_text('You have completed 0 of 4 sections.')
  expect(page).to have_text("You'll be able to check and submit this export once you've completed all the sections.")
end

And(/^I see these four sections$/) do
  expect(page).to have_css 'h2', text: 'About the waste', exact_text: true
  expect(page).to have_css 'h2', text: 'Exporter and importer', exact_text: true
  expect(page).to have_css 'h2', text: 'Journey of waste', exact_text: true
  expect(page).to have_css 'h2', text: 'Treatment of waste', exact_text: true
end

And(/^the task "([^"]*)" should be "([^"]*)"$/) do |task_name, task_status|
  expect(SubmitAnExportPage.new).to have_completed_badge_for_task task_name, task_status
end

And(/^I click "([^"]*)" from the breadcrumb$/) do |link|
  click_link link
end

And(/^the new reference should be displayed$/) do
  expect(SubmitAnExportPage.new.reference_number.text).to eq("Your reference: #{TestStatus.test_status(:new_application_reference_number)}")
end

And(/^I click the link Return to this draft later$/) do
  click_link 'Return to this draft later'
end

And(/^I complete Waste codes and description task$/) do
  SubmitAnExportPage.new.waste_codes_and_description
  WasteCodeController.complete
  NationalCodeController.complete
  DescribeTheWasteController.complete
  QuantityOfWastePage.new.save_and_return_to_draft
end

And(/^I have (\d+) of 4 sections completed$/) do |completed|
  expect(page).to have_text("You have completed #{completed} of 4 sections.")
end
