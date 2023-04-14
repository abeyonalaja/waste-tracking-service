Given(/^I navigate to whats the waste code page$/) do
  click_link('Green list waste overview')
  OverviewPage.new.submit_a_single_waste_export
  AddReferenceNumberController.complete
  SubmitAnExportPage.new.waste_codes_and_description
end

When(/^I choose Not applicable option$/) do
  EnterAnEwcCodePage.new.choose_option 'Not applicable'
  TestStatus.set_test_status(:waste_code_option, 'Not applicable')
  Log.info("Waste code option :  #{TestStatus.test_status(:waste_code_option)}")
end

When(/^I choose "([^"]*)" as a waste code$/) do |waste_code_option|
  WhatIsTheWasteCodePage.new.choose_option waste_code_option
  TestStatus.set_test_status(:waste_code_option, waste_code_option)
  Log.info("Waste code option :  #{TestStatus.test_status(:waste_code_option)}")
end

And(/^select a first option as waste code description$/) do
  WhatIsTheWasteCodePage.new.select_first_option
end

Then(/^"([^"]*)" is still selected$/) do |option|
  expect(WhatIsTheWasteCodePage.new.waste_code_option(option)).to be_checked
end

And(/^waste code description is displayed$/) do
  expect(WhatIsTheWasteCodePage.new).to have_waste_code TestStatus.test_status(:waste_code_description)
end
