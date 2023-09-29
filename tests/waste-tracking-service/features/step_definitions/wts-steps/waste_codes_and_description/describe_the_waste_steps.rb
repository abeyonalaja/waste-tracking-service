And(/^I navigate on the Describe the waste$/) do
  click_link('dashboard_link')
  ExportWasteFromUkPage.new.create_single_annex_record
  AddReferenceNumberController.complete
  TaskListPage.new.waste_codes_and_description
  WasteCodeController.complete
  EwcCodeController.complete
  NationalCodeController.complete
  DescribeTheWastePage.new.check_page_displayed
end

Then(/^I should see previously entered waste description details$/) do
  expect(DescribeTheWastePage.new.check_description).to eq(TestStatus.test_status(:description_of_the_waste))
end

And(/^I verify data is wiped out$/) do
  expect(page).to have_field('description', with: '')
end
