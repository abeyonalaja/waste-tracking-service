Then(/^I verify add ewc code page is displayed$/) do
  EnterAnEwcCodePage.new.check_page_displayed
end

And(/^I navigate to Add EWC code page$/) do
  ExportWasteFromUkPage.new.create_single_annex_record
  AddReferenceNumberController.complete
  TaskListPage.new.waste_codes_and_description
  WasteCodeController.complete
end

Then(/^I verify copy text is present on the EWC page$/) do
  EnterAnEwcCodePage.new.check_translation
end

And(/^I have selected valid ewc code$/) do
  EnterAnEwcCodePage.new.select_first_option
end

Then(/^I verify Do you need to add another page is displayed$/) do
  expect(self).to have_text(Translations.value('exportJourney.ewc.addAnotherTitle'))
  expect(self).to have_link(Translations.value('actions.remove'))
end

Then(/^I verify that National code page is displayed$/) do
  NationalCodePage.new.check_page_displayed
end

When(/^I verify enter ewc code page is displayed$/) do
  EnterAnEwcCodePage.new.check_page_displayed
end

Then(/^the question "Do you need to add another EWC code\? is hidden$/) do
  expect(page).to have_text('You have added 5 EWC codes') # no transl value
  expect(page).to_not have_text(Translations.value('exportJourney.addedEwcCode.question'))
end

Then(/^I verify that task list page is displayed$/) do
  TaskListPage.new.check_page_displayed
end

Given(/^I navigate to ewc code page with selecting Not applicable option on waste code page$/) do
  ExportWasteFromUkPage.new.create_single_annex_record
  AddReferenceNumberController.complete
  TaskListPage.new.waste_codes_and_description
  whats_waste_code_page = WhatIsTheWasteCodePage.new
  whats_waste_code_page.choose_option(Translations.value('notApplicable'))
  whats_waste_code_page.save_and_continue
end

And(/^I click Change link$/) do
  click_link(Translations.value('actions.change'))
end

And(/^I click Remove link$/) do
  click_link(Translations.value('actions.remove'))
end

Then(/^I verify confirmation page is displayed$/) do
  title = "#{Translations.value 'exportJourney.ewc.confirmRemoveTitle'}".gsub!('{{code}}', '01 01 01')
  expect(page).to have_text title
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
  expect(page).to have_text(Translations.value('errorSummary.title'))
  expect(page).to have_text('Select yes if you want to add an EWC code') # no transl value
end

Then(/^I verify ewc code error is displayed$/) do
  expect(page).to have_text(Translations.value('errorSummary.title'))
  expect(page).to have_text('Select an EWC code') # no transl value
end

And(/^I verify Do you need to add another EWC code question is not present on the page$/) do
  expect(page).not_to have_text(Translations.value('exportJourney.addedEwcCode.question'))
end

Then(/^I add (\d+) ewc codes$/) do |ewc_code|
  (1..ewc_code).each do |i|
    enter_an_ewc_code_page = EnterAnEwcCodePage.new
    ewc_code_list_page = EwcCodeListPage.new
    HelperMethods.wait_for_a_sec
    ewc_code_list_page.choose_option(Translations.value('radio.yes'))
    ewc_code_list_page.save_and_continue
    puts TestData.get_ewc_codes i
    EnterAnEwcCodePage.new.enter_ewc_code TestData.get_ewc_codes i
    enter_an_ewc_code_page.save_and_continue
  end
end

Then(/^I should see previously selected EWC code pre\-populated$/) do
  expect(EnterAnEwcCodePage.new.ewc_code).to eq(TestStatus.test_status(:ewc_code))
end
