Then(/^task list page is displayed$/) do
  TaskListPage.new.check_page_displayed
  @url = URI.parse(TaskListPage.new.current_url)
  Log.info("Export url is: #{@url}")
end

And(/^the reference should be displayed$/) do
  expect(TaskListPage.new.reference_number.text).to eq("Your reference: #{TestStatus.test_status(:application_reference_number)}")
end

When(/^I navigate to the task list page with reference$/) do
  ExportWasteFromUkPage.new.create_single_annex_record
  AddReferenceNumberController.complete
end

Then(/^I have submission incomplete 0 of 5 sections$/) do
  TaskListPage.new.check_page_translation
end

And(/^I see these five sections$/) do
  expect(page).to have_css 'h2', text: 'About the waste', exact_text: true
  expect(page).to have_css 'h2', text: 'Exporter and importer', exact_text: true
  expect(page).to have_css 'h2', text: 'Journey of waste', exact_text: true
  expect(page).to have_css 'h2', text: 'Treatment of waste', exact_text: true
  expect(page).to have_css 'h2', text: 'Final checks', exact_text: true
end

And(/^the task "([^"]*)" should be "([^"]*)"$/) do |task_name, task_status|
  expect(TaskListPage.new).to have_completed_badge_for_task task_name, task_status
end

And(/^I click "([^"]*)" from the breadcrumb$/) do |link|
  click_link link
end

And(/^the new reference should be displayed$/) do
  expect(TaskListPage.new.reference_number.text).to eq("Your reference: #{TestStatus.test_status(:new_application_reference_number)}")
end

And(/^I click the link Return to this draft later$/) do
  click_link 'Return to this draft later'
end

And(/^I complete Waste codes and description task$/) do
  TaskListPage.new.waste_codes_and_description
  WasteCodeController.complete
  EwcCodeController.complete
  NationalCodeController.complete
  DescribeTheWasteController.complete
  sleep 1
  QuantityOfWastePage.new.check_page_displayed
  QuantityOfWastePage.new.back
  DescribeTheWastePage.new.check_page_displayed
  DescribeTheWastePage.new.save_and_return
end

And(/^I have (\d+) of 5 sections completed$/) do |completed|
  text1 = Translations.value 'exportJourney.submitAnExport.completedSectionsA'
  text2 = Translations.value 'exportJourney.submitAnExport.completedSectionsB'
  expect(page).to have_text("#{text1} #{completed} #{text2}")
end

And(/^I click Export waste from UK breadcrumb$/) do
  click_link('glw-index-link')
end

And(/^I click Move export or import waste breadcrumb$/) do
  click_link('index-link')
end
