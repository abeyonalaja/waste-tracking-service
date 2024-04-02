Then(/^Enter an EWC code is displayed$/) do
  EnterAnEwcCodePage.new.check_page_displayed
end

When(/^I navigate to You have added EWC codes page with Not applicable waste code$/) do
  TaskListPage.new.waste_codes_and_description
  ClassificationOfTheWastePage.new.choose_option Translations.value 'notApplicable'
  TestStatus.set_test_status(:waste_code_option, 'Not applicable')
end

Then(/^I should see (\d+) EWC code added to the export$/) do |no_of_ewc_codes|
  expect(page).to have_text(Translations.value('exportJourney.ewc.maxReached'))
end


When(/^I enter valid ewc code$/) do
  code = TestData.get_ewc_codes 0
  EnterAnEwcCodePage.new.enter_ewc_code code
  TestStatus.set_test_status(:ewc_code, code)
end

Then(/^I should see ewc code description on EWC list page$/) do
  expect(EnterAnEwcCodePage.new.ewc_code_description.text).to have_text(TestData.get_ewc_code_description(TestStatus.test_status(:ewc_code)))
end

When(/^I enter invalid EWC code$/) do
  EnterAnEwcCodePage.new.enter_ewc_code '123124'
end

When(/^I enter invalid EWC code less then 6 digit$/) do
  EnterAnEwcCodePage.new.enter_ewc_code '0101'
end
