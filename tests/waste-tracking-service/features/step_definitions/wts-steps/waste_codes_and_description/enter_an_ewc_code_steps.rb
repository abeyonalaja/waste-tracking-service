Then(/^Enter an EWC code is displayed$/) do
  EnterAnEwcCodePage.new.check_page_displayed
end

And(/^I choose first EWC code description from list$/) do
  EnterAnEwcCodePage.new.select_ewc_option 1
end

When(/^I navigate to You have added EWC codes page with Not applicable waste code$/) do
  SubmitAnExportPage.new.waste_codes_and_description
  WhatIsTheWasteCodePage.new.choose_option 'Not applicable'
  TestStatus.set_test_status(:waste_code_option, 'Not applicable')
end

Then(/^I should see (\d+) EWC code added to the export$/) do |no_of_ewc_codes|
  expect(page).to have_text("You have added #{no_of_ewc_codes} EWC codes")
end

Then(/^EWC code page is display with no ewc codes$/) do
  expect(page).to have_text('You have added 0 EWC codes')
end
