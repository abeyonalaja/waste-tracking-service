Then(/^Submit an export page is displayed$/) do
  SubmitAnExportPage.new.check_page_displayed
end

And(/^the reference should be displayed$/) do
  expect(SubmitAnExportPage.new.reference_number.text).to eq("Your reference: #{TestStatus.test_status(:application_reference_number)}")
end

When(/^I navigate to the submit an export with reference$/) do
  click_link('dashboard_link')
  ExportWasteFromUkPage.new.create_single_annex_record
  AddReferenceNumberController.complete
end

When(/^I navigate to the submit an export with no reference$/) do
  click_link('dashboard_link')
  ExportWasteFromUkPage.new.create_single_annex_record
  AddReferenceNumberController.complete 'No'
end

Then(/^I have submission incomplete 0 of 5 sections$/) do
  expect(page).to have_text('You have completed 0 of 5 sections.')
  expect(page).to have_text("You'll be able to check and submit this record once you've completed all the sections.")
end

And(/^I see these five sections$/) do
  expect(page).to have_css 'h2', text: 'About the waste', exact_text: true
  expect(page).to have_css 'h2', text: 'Exporter and importer', exact_text: true
  expect(page).to have_css 'h2', text: 'Journey of waste', exact_text: true
  expect(page).to have_css 'h2', text: 'Treatment of waste', exact_text: true
  expect(page).to have_css 'h2', text: 'Final checks', exact_text: true
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
  EwcCodeController.complete
  NationalCodeController.complete
  DescribeTheWasteController.complete
  sleep 1
  QuantityOfWastePage.new.check_page_displayed
  QuantityOfWastePage.new.back
  DescribeTheWastePage.new.save_and_return
end

And(/^I have (\d+) of 5 sections completed$/) do |completed|
  expect(page).to have_text("You have completed #{completed} of 5 sections.")
end

And(/^I click Export waste from UK breadcrumb$/) do
  click_link('glw-index-link')
end

And(/^I click Move export or import waste breadcrumb$/) do
  click_link('index-link')
end

And(/^I navigate to Export waste from UK page$/) do
  click_link('dashboard_link')
end
