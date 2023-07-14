Then(/^I verify add ewc code page is displayed$/) do
  DoYouHaveEwcCodePage.new.check_page_displayed
end

And(/^I navigate to Add EWC code page$/) do
  click_link('Green list waste overview')
  OverviewPage.new.submit_a_single_waste_export
  AddReferenceNumberController.complete
  SubmitAnExportPage.new.waste_codes_and_description
  WasteCodeController.complete
end

Then(/^I verify copy text is present on the EWC page$/) do
  DoYouHaveEwcCodePage.new.check_translation
end

And(/^I have selected valid ewc code$/) do
  DoYouHaveEwcCodePage.new.select_first_option
end

Then(/^I verify Do you need to add another page is displayed$/) do
  expect(self).to have_text('Do you need to add another EWC code?')
  expect(self).to have_link('Remove')
end

Then(/^I verify that National code page is displayed$/) do
  NationalCodePage.new.check_page_displayed
end

When(/^I verify enter ewc code page is displayed$/) do
  EnterAnEwcCodePage.new.check_page_displayed
  expect(page).to have_text('Choose from the list or start typing')
end

Then(/^the question "Do you need to add another EWC code\? is hidden$/) do
  expect(page).to have_text('You have added 5 EWC codes')
  expect(page).to_not have_text('Do you need to add another EWC code?')
end

Then(/^I verify that Submit an export page is displayed$/) do
  SubmitAnExportPage.new.check_page_displayed
end

Given(/^I navigate to ewc code page with selecting Not applicable option on waste code page$/) do
  click_link('Green list waste overview')
  OverviewPage.new.submit_a_single_waste_export
  AddReferenceNumberController.complete
  SubmitAnExportPage.new.waste_codes_and_description
  whats_waste_code_page = WhatIsTheWasteCodePage.new
  whats_waste_code_page.choose_option('Not applicable')
  whats_waste_code_page.save_and_continue
end

And(/^I click Change link$/) do
  click_link('Change')
end

And(/^I click Remove link$/) do
  click_link('Remove')
end

Then(/^I verify confirmation page is displayed$/) do
  expect(page).to have_text('Are you sure you want to remove this EWC code?')
end

And(/^I verify the code is added$/) do
  expect(page).to have_text('You have added 1 EWC codes')
end

And(/^I verify the code is removed$/) do
  expect(page).to have_text('You have added 0 EWC codes')
end

Then(/^I verify What's the waste code page is displayed$/) do
  WhatIsTheWasteCodePage.new.check_page_displayed
end

Then(/^I verify option selection error is displayed$/) do
  expect(page).to have_text('There is a problem')
  expect(page).to have_text('Select yes if you want to add an EWC code')
end

Then(/^I verify ewc code error is displayed$/) do
  expect(page).to have_text('There is a problem')
  expect(page).to have_text('Select an EWC code')
end

And(/^I verify Do you need to add another EWC code question is not present on the page$/) do
  expect(page).not_to have_text('Do you need to add another EWC code?')
end

And(/^I verify that i have added 5 ewc codes$/) do
  expect(page).to have_text('You have added 5 EWC codes')
end


Then(/^I add (\d+) ewc codes$/) do |ewc_code|
  (1..ewc_code).each do |i|
    enter_an_ewc_code_page = EnterAnEwcCodePage.new
    ewc_code_list_page = EwcCodeListPage.new
    ewc_code_list_page.choose_option('Yes')
    ewc_code_list_page.save_and_continue
    enter_an_ewc_code_page.select_ewc_option rand(0..834)
    enter_an_ewc_code_page.save_and_continue
  end
end

Then(/^I should see previously selected EWC code pre\-populated$/) do
  expect(DoYouHaveEwcCodePage.new.ewc_code).to eq(TestStatus.test_status(:ewc_code))
end
